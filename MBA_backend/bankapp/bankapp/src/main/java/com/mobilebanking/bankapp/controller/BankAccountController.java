package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/account")
public class BankAccountController {

    @Autowired
    private BankAccountRepository accountRepo;

    @PostMapping("/add")
    public BankAccount addAccount(@RequestBody BankAccount account) {
        account.setBalance(0); // dummy value
        return accountRepo.save(account);
    }

    @GetMapping("/user/{userId}")
    public List<BankAccount> getUserAccounts(@PathVariable Long userId) {
        return accountRepo.findByUserId(userId);
    }

    @GetMapping("/{accountId}/balance")
    public ResponseEntity<?> getBalance(@PathVariable Long accountId) {
        return accountRepo.findById(accountId)
                .map(account -> ResponseEntity.ok(account.getBalance()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/random")
    public ResponseEntity<?> getRandomAccount(@RequestHeader("User-Id") Long loggedInUserId) {
        List<BankAccount> allAccounts = accountRepo.findAll();
        List<BankAccount> otherAccounts = allAccounts.stream()
                .filter(account -> !account.getUser().getId().equals(loggedInUserId))
                .collect(Collectors.toList());

        if (otherAccounts.isEmpty()) {
            return ResponseEntity.badRequest().body("No other accounts available");
        }

        Random random = new Random();
        BankAccount randomAccount = otherAccounts.get(random.nextInt(otherAccounts.size()));
        return ResponseEntity.ok(new RandomAccountResponse(
                randomAccount.getAccountNumber(),
                randomAccount.getUser().getName()
        ));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<?> getAccountByNumber(@PathVariable String accountNumber, @RequestHeader("User-Id") Long loggedInUserId) {
        BankAccount account = accountRepo.findByAccountNumber(accountNumber);
        if (account == null) {
            return ResponseEntity.notFound().build();
        }
        if (account.getUser().getId().equals(loggedInUserId)) {
            return ResponseEntity.badRequest().body("Cannot pay to your own account");
        }
        return ResponseEntity.ok(new RandomAccountResponse(
                account.getAccountNumber(),
                account.getUser().getName()
        ));
    }

    private static class RandomAccountResponse {
        private String accountNumber;
        private String userName;

        public RandomAccountResponse(String accountNumber, String userName) {
            this.accountNumber = accountNumber;
            this.userName = userName;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public String getUserName() {
            return userName;
        }
    }
}