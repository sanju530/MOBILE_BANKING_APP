package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.payload.TransactionRequest;
import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    @Autowired
    private BankAccountRepository accountRepo;

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody TransactionRequest req) {
        Optional<BankAccount> fromOptional = accountRepo.findByAccountNumber(req.getFromAccountNumber());
        BankAccount from = fromOptional.orElse(null);

        Optional<BankAccount> toOptional = accountRepo.findByAccountNumber(req.getToAccountNumber());
        BankAccount to = toOptional.orElse(null);

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
        Optional<BankAccount> accountOptional = accountRepo.findById(accountId);
        BankAccount account = accountOptional.orElse(null);
        if (account == null) {
            return "Invalid account ID";
        }
        return "upi://pay?pa=" + account.getAccountNumber() + "&pn=" + account.getUser().getName() + "&tid=" + accountId;
    }
}