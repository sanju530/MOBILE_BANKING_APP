package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.model.Loan;
import com.mobilebanking.bankapp.repository.LoanRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; // If you're using findById()

@RestController
@RequestMapping("/loan")
public class LoanController {

    @Autowired
    private LoanRepository loanRepo;

    @PostMapping("/apply")
    public ResponseEntity<?> applyLoan(@RequestBody Loan loan) {
        if (loanRepo.findByAccountId(loan.getAccount().getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Loan already taken on this account.");
        }

        loan.setTerms("Max ₹100,000 | 7% interest | 2-year term");
        return ResponseEntity.ok(loanRepo.save(loan));
    }
}
