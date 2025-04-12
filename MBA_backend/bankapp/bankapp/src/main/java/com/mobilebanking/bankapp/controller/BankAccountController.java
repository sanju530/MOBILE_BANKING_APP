package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; // If you're using findById()
import java.util.List;

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
}
