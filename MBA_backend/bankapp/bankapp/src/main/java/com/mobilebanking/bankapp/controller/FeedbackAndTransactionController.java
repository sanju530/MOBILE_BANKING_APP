package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.model.Billing;
import com.mobilebanking.bankapp.model.Feedback;
import com.mobilebanking.bankapp.model.Rating;
import com.mobilebanking.bankapp.model.ReceiveRequest;
import com.mobilebanking.bankapp.model.TransactionHistory;
import com.mobilebanking.bankapp.payload.TransactionRequest;
import com.mobilebanking.bankapp.repository.BankAccountRepository;
import com.mobilebanking.bankapp.repository.BillingRepository;
import com.mobilebanking.bankapp.repository.FeedbackRepository;
import com.mobilebanking.bankapp.repository.RatingRepository;
import com.mobilebanking.bankapp.repository.ReceiveRequestRepository;
import com.mobilebanking.bankapp.repository.TransactionHistoryRepository;
import com.mobilebanking.bankapp.dto.TransactionHistoryDTO;
import com.mobilebanking.bankapp.factory.TransactionFactory;
import com.mobilebanking.bankapp.strategy.TransactionStrategy; // Ensure this import is present
import com.mobilebanking.bankapp.strategy.TransactionStrategyFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FeedbackAndTransactionController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackAndTransactionController.class);

    private final FeedbackRepository feedbackRepo;
    private final TransactionHistoryRepository transactionHistoryRepo;
    private final BankAccountRepository accountRepo;
    private final BillingRepository billingRepo;
    private final RatingRepository ratingRepo;
    private final ReceiveRequestRepository receiveRequestRepo;
    private final TransactionStrategyFactory strategyFactory;

    @Autowired
    public FeedbackAndTransactionController(
            FeedbackRepository feedbackRepo,
            TransactionHistoryRepository transactionHistoryRepo,
            BankAccountRepository accountRepo,
            BillingRepository billingRepo,
            RatingRepository ratingRepo,
            ReceiveRequestRepository receiveRequestRepo,
            TransactionStrategyFactory strategyFactory) {
        this.feedbackRepo = feedbackRepo;
        this.transactionHistoryRepo = transactionHistoryRepo;
        this.accountRepo = accountRepo;
        this.billingRepo = billingRepo;
        this.ratingRepo = ratingRepo;
        this.receiveRequestRepo = receiveRequestRepo;
        this.strategyFactory = strategyFactory;
    }

    @PostMapping("/feedback")
    public ResponseEntity<String> addFeedback(@RequestBody Feedback feedback) {
        if (feedback.getUserId() == null || feedback.getUsername() == null || feedback.getFeedbackText() == null) {
            return ResponseEntity.badRequest().body("User ID, username, and feedback text are required");
        }
        feedbackRepo.save(feedback);
        return ResponseEntity.ok("Feedback submitted successfully");
    }

    @PostMapping("/transaction")
    @Transactional
    public ResponseEntity<String> addTransaction(@RequestBody TransactionRequest request) {
        logger.info("Received transaction request: {}", request);

        if (request.getUserId() == null || request.getAmount() <= 0) {
            logger.error("Invalid transaction data: User ID or amount invalid");
            return ResponseEntity.badRequest().body("User ID and valid amount are required");
        }

        BankAccount fromAccount = accountRepo.findByAccountNumber(request.getFromAccountNumber())
                .orElse(null);
        if (fromAccount == null) {
            logger.error("Invalid source account number: {}", request.getFromAccountNumber());
            return ResponseEntity.badRequest().body("Invalid source account number");
        }
        if (fromAccount.getBalance() < request.getAmount()) {
            logger.error("Insufficient balance in account {}: {}", fromAccount.getId(), fromAccount.getBalance());
            return ResponseEntity.badRequest().body("Insufficient balance");
        }

        BankAccount toAccount = null;
        if (request.getToAccountNumber() != null) {
            toAccount = accountRepo.findByAccountNumber(request.getToAccountNumber())
                    .orElse(null);
            if (toAccount != null) {
                // toAccountId will be set by the factory
            }
        }

        TransactionHistory transaction = TransactionFactory.createTransaction(request, fromAccount, toAccount);
        try {
            TransactionStrategy strategy = strategyFactory.getStrategy(request.getTransactionType());
            strategy.processTransaction(transaction, fromAccount, toAccount, request);

            TransactionHistory savedTransaction = transactionHistoryRepo.saveAndFlush(transaction);
            logger.info("Transaction history saved: ID {}", savedTransaction.getId());

            Billing billing = TransactionFactory.createBilling(savedTransaction, request);
            if (billing != null) {
                billingRepo.save(billing);
                logger.info("Billing record saved: ID {}", billing.getId());
            }
        } catch (IllegalArgumentException e) {
            logger.error("Transaction processing failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Transaction failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Transaction failed: " + e.getMessage());
        }

        return ResponseEntity.ok("Transaction recorded successfully");
    }

    @PostMapping("/rating")
    @Transactional
    public ResponseEntity<String> addRating(@RequestBody Rating rating) {
        logger.info("Received rating request: {}", rating);

        if (rating.getUserId() == null || rating.getRating() == null || rating.getRating() < 1 || rating.getRating() > 5) {
            logger.error("Invalid rating data: User ID or rating invalid");
            return ResponseEntity.badRequest().body("User ID and valid rating (1-5) are required");
        }

        try {
            if (!accountRepo.existsById(rating.getUserId())) {
                logger.error("User ID {} does not exist", rating.getUserId());
                return ResponseEntity.badRequest().body("User does not exist");
            }
            ratingRepo.save(rating);
            logger.info("Rating saved: ID {}", rating.getId());
        } catch (Exception e) {
            logger.error("Rating save failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Rating save failed: " + e.getMessage());
        }

        return ResponseEntity.ok("Rating submitted successfully");
    }

    @PostMapping("/receive")
    @Transactional
    public ResponseEntity<ReceiveRequest> createReceiveRequest(@RequestBody ReceiveRequest request) {
        logger.info("Received receive request: {}", request);

        if (request.getUserId() == null || request.getAccountNumber() == null || request.getAmount() <= 0) {
            logger.error("Invalid receive request data: User ID, account number, or amount invalid");
            return ResponseEntity.badRequest().body(null);
        }

        try {
            BankAccount account = accountRepo.findByAccountNumber(request.getAccountNumber()).orElse(null);
            if (account == null || !account.getUser().getId().equals(request.getUserId())) {
                logger.error("Invalid account number {} for user ID {}", request.getAccountNumber(), request.getUserId());
                return ResponseEntity.badRequest().body(null);
            }

            String qrCodeData = "RECEIVE:" + request.getAccountNumber() + ":" + request.getAmount();
            request.setQrCode(qrCodeData);
            request.setStatus("PENDING");

            ReceiveRequest savedRequest = receiveRequestRepo.save(request);
            logger.info("Receive request saved: ID {}", savedRequest.getId());
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            logger.error("Receive request failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<TransactionHistoryDTO>> getUserTransactions(@PathVariable Long userId) {
        logger.info("Fetching transactions for userId: {}", userId);
        try {
            List<TransactionHistory> transactions = transactionHistoryRepo.findAll().stream()
                    .filter(t -> t.getUserId().equals(userId))
                    .collect(Collectors.toList());
            if (transactions.isEmpty()) {
                logger.warn("No transactions found for userId: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            List<TransactionHistoryDTO> dtos = transactions.stream()
                    .map(t -> new TransactionHistoryDTO(
                            t.getId(),
                            t.getTransactionType(),
                            t.getFromAccountId(),
                            t.getToAccountId(),
                            t.getAmount(),
                            t.getUpiId(),
                            t.getStatus(),
                            t.getCreatedAt()))
                    .collect(Collectors.toList());
            logger.info("Found {} transactions for userId: {}", dtos.size(), userId);
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Error fetching transactions for userId {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/account/{accountNumber}/id")
    public ResponseEntity<Long> getAccountIdByAccountNumber(@PathVariable String accountNumber) {
        logger.info("Fetching account ID for accountNumber: {}", accountNumber);
        BankAccount account = accountRepo.findByAccountNumber(accountNumber)
                .orElse(null);
        if (account == null) {
            logger.error("No account found for accountNumber: {}", accountNumber);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        logger.info("Found account ID: {} for accountNumber: {}", account.getId(), accountNumber);
        return ResponseEntity.ok(account.getId());
    }
}