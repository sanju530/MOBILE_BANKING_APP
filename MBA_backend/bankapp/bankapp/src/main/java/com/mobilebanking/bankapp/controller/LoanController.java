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

    // Loan type configurations
    private static final Map<String, LoanConfig> LOAN_CONFIGS = new HashMap<>();

    static {
        LOAN_CONFIGS.put("personal", new LoanConfig(100000, 7.0, 24, "Max ₹100,000 | 7% interest | 2-year term"));
        LOAN_CONFIGS.put("home", new LoanConfig(500000, 6.5, 120, "Max ₹500,000 | 6.5% interest | 10-year term"));
        LOAN_CONFIGS.put("vehicle", new LoanConfig(300000, 7.5, 36, "Max ₹300,000 | 7.5% interest | 3-year term"));
        LOAN_CONFIGS.put("education", new LoanConfig(200000, 6.0, 60, "Max ₹200,000 | 6% interest | 5-year term"));
        LOAN_CONFIGS.put("medical", new LoanConfig(150000, 8.0, 12, "Max ₹150,000 | 8% interest | 1-year term"));
    }

    private static class LoanConfig {
        private final double maxAmount;
        private final double interestRate;
        private final int termInMonths;
        private final String terms;

        LoanConfig(double maxAmount, double interestRate, int termInMonths, String terms) {
            this.maxAmount = maxAmount;
            this.interestRate = interestRate;
            this.termInMonths = termInMonths;
            this.terms = terms;
        }
    }

    @GetMapping("/instructions")
    public ResponseEntity<String> getLoanInstructions() {
        String instructions = "Loan Instructions:\n" +
                "- Different limits apply based on loan type.\n" +
                "- Interest rates and terms vary by type.\n" +
                "- Only one loan per user is allowed across all accounts.\n" +
                "- Approval is handled by the bank.";
        return ResponseEntity.ok(instructions);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getLoanStatus(@RequestHeader("User-Id") Long userId) {
        Map<String, Boolean> status = new HashMap<>();
        // Check if the user has any active loan across all accounts
        status.put("hasActiveLoan", loanRepo.existsByAccountUserId(userId));
        return ResponseEntity.ok(status);
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyLoan(@RequestBody Loan loan, @RequestHeader("User-Id") Long userId) {
        // Check if the user has an active loan across all accounts
        if (loanRepo.existsByAccountUserId(userId)) {
            return ResponseEntity.badRequest().body("You have already taken a loan with another account. No further applications are allowed.");
        }

        // Validate account
        if (loan.getAccount() == null || loan.getAccount().getId() == null) {
            return ResponseEntity.badRequest().body("Account is required for loan application.");
        }

        // Check if a loan already exists for the specific account
        if (loanRepo.findByAccountId(loan.getAccount().getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Loan already taken on this account.");
        }

        // Validate and set loan type-specific configuration
        String loanType = loan.getLoanType() != null ? loan.getLoanType().toLowerCase() : "personal";
        LoanConfig config = LOAN_CONFIGS.getOrDefault(loanType, LOAN_CONFIGS.get("personal"));

        if (loan.getAmount() > config.maxAmount) {
            return ResponseEntity.badRequest().body("Loan amount exceeds the maximum limit of ₹" + config.maxAmount + " for " + loanType + " loan.");
        }

        // Apply loan type-specific terms
        loan.setTerms(config.terms);
        loan.setInterestRate(config.interestRate);
        loan.setTermInMonths(config.termInMonths);

        // Save the loan application
        Loan savedLoan = loanRepo.save(loan);

        return ResponseEntity.ok(savedLoan);
    }
}