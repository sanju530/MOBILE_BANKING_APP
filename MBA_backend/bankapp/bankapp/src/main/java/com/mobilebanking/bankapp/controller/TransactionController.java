package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.payload.TransactionRequest;
import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    @Autowired
    private BankAccountRepository accountRepo;

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody TransactionRequest req) {
        BankAccount from = accountRepo.findByAccountNumber(req.getFromAccountNumber());
        BankAccount to = accountRepo.findByAccountNumber(req.getToAccountNumber());

        if (from == null || to == null) {
            return ResponseEntity.badRequest().body("Invalid account number");
        }

        if (from.getBalance() < req.getAmount()) {
            return ResponseEntity.badRequest().body("Insufficient funds");
        }

        from.setBalance(from.getBalance() - req.getAmount());
        to.setBalance(to.getBalance() + req.getAmount());

        accountRepo.save(from);
        accountRepo.save(to);

        return ResponseEntity.ok("Payment successful!");
    }

    @GetMapping("/receive/{accountId}")
    public String generateQRCode(@PathVariable Long accountId) {
        BankAccount account = accountRepo.findById(accountId).orElse(null);
        if (account == null) {
            return "Invalid account ID";
        }
        return "upi://pay?pa=" + account.getAccountNumber() + "&pn=" + account.getUser().getName() + "&tid=" + accountId;
    }
}