package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.repository.BankAccountRepository;
import com.mobilebanking.bankapp.dto.BankAccountDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/account")
public class BankAccountController {

    private static final Logger logger = LoggerFactory.getLogger(BankAccountController.class);

    @Autowired
    private BankAccountRepository accountRepo;

    @PostMapping("/add")
    public ResponseEntity<String> addAccount(@RequestBody BankAccount account) {
        if (account.getBankName() == null || account.getAccountNumber() == null) {
            return ResponseEntity.badRequest().body("Bank name and account number are required");
        }
        Random random = new Random();
        double randomBalance = 500 + (random.nextDouble() * 9500);
        account.setBalance(randomBalance);
        accountRepo.save(account);
        logger.info("Account added successfully for accountNumber: {}", account.getAccountNumber());
        return ResponseEntity.ok("Account added successfully");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BankAccountDTO>> getUserAccounts(@PathVariable Long userId) {
        logger.info("Fetching accounts for userId: {}", userId);
        try {
            List<BankAccount> accounts = accountRepo.findByUser_Id(userId);
            if (accounts.isEmpty()) {
                logger.warn("No accounts found for userId: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            List<BankAccountDTO> dtos = accounts.stream()
                    .map(account -> new BankAccountDTO(
                            account.getId(),
                            account.getAccountNumber(),
                            account.getBalance(),
                            account.getBankCode(),
                            account.getBankName()))
                    .collect(Collectors.toList());
            logger.info("Found {} accounts for userId: {}", dtos.size(), userId);
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Error fetching accounts for userId {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{accountId}/balance")
    public ResponseEntity<Object> getBalance(@PathVariable Long accountId) {
        return accountRepo.findById(accountId)
                .map(account -> ResponseEntity.ok((Object) account.getBalance()))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found"));
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long accountId) {
        if (accountRepo.existsById(accountId)) {
            accountRepo.deleteById(accountId);
            logger.info("Account deleted successfully for accountId: {}", accountId);
            return ResponseEntity.ok("Account deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found");
    }

    @GetMapping("/random")
    public ResponseEntity<Object> getRandomAccount(@RequestHeader("User-Id") Long loggedInUserId) {
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
    public ResponseEntity<Object> getAccountByNumber(@PathVariable String accountNumber, @RequestHeader("User-Id") Long loggedInUserId) {
        BankAccount account = accountRepo.findByAccountNumber(accountNumber);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found");
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

        public String getAccountNumber() { return accountNumber; }
        public String getUserName() { return userName; }
    }
}