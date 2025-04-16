package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.model.Loan;
import com.mobilebanking.bankapp.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/loan")
public class LoanController {

    @Autowired
    private LoanRepository loanRepo;

    // Static flag to track global loan application status
    private static boolean hasActiveLoan = false;

    @GetMapping("/instructions")
    public ResponseEntity<String> getLoanInstructions() {
        String instructions = "Loan Instructions:\n" +
                "- Maximum loan amount: ₹100,000\n" +
                "- Interest rate: 7%\n" +
                "- Term: 2 years\n" +
                "- Only one loan per application is allowed globally.\n" +
                "- Approval is handled by the bank.";
        return ResponseEntity.ok(instructions);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getLoanStatus() {
        Map<String, Boolean> status = new HashMap<>();
        status.put("hasActiveLoan", hasActiveLoan);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyLoan(@RequestBody Loan loan) {
        // Check global loan restriction
        if (hasActiveLoan) {
            return ResponseEntity.badRequest().body("A loan has already been applied globally. No further applications are allowed.");
        }

        // Check if a loan already exists for the bank account
        if (loanRepo.findByAccountId(loan.getAccount().getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Loan already taken on this account.");
        }

        // Validate loan amount
        if (loan.getAmount() > 100000) {
            return ResponseEntity.badRequest().body("Loan amount exceeds the maximum limit of ₹100,000.");
        }

        // Set predefined loan terms
        loan.setTerms("Max ₹100,000 | 7% interest | 2-year term");
        loan.setInterestRate(7.0);
        loan.setTermInMonths(24);

        // Save the loan application and set global flag
        Loan savedLoan = loanRepo.save(loan);
        hasActiveLoan = true;

        return ResponseEntity.ok(savedLoan);
    }
}