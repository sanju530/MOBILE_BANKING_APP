package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.model.Feedback;
import com.mobilebanking.bankapp.model.TransactionHistory;
import com.mobilebanking.bankapp.model.User;
import com.mobilebanking.bankapp.repository.BankAccountRepository;
import com.mobilebanking.bankapp.repository.FeedbackRepository;
import com.mobilebanking.bankapp.repository.TransactionHistoryRepository;
import com.mobilebanking.bankapp.dto.TransactionHistoryDTO; // New DTO
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FeedbackAndTransactionController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackAndTransactionController.class);

    @Autowired
    private FeedbackRepository feedbackRepo;

    @Autowired
    private TransactionHistoryRepository transactionHistoryRepo;

    @Autowired
    private BankAccountRepository accountRepo;

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
    public ResponseEntity<String> addTransaction(@RequestBody TransactionHistory transaction) {
        logger.info("Received transaction request: {}", transaction);
        if (transaction.getUserId() == null || transaction.getAmount() <= 0) {
            logger.error("Invalid transaction data: User ID or amount invalid");
            return ResponseEntity.badRequest().body("User ID and valid amount are required");
        }

        BankAccount fromAccount = null;
        BankAccount toAccount = null;

        if (transaction.getFromAccountId() != null) {
            fromAccount = accountRepo.findById(transaction.getFromAccountId()).orElse(null);
            if (fromAccount == null) {
                logger.error("Invalid source account ID: {}", transaction.getFromAccountId());
                return ResponseEntity.badRequest().body("Invalid source account ID");
            }
            if (fromAccount.getBalance() < transaction.getAmount()) {
                logger.error("Insufficient balance in account {}: {}", transaction.getFromAccountId(), fromAccount.getBalance());
                return ResponseEntity.badRequest().body("Insufficient balance");
            }
        }

        try {
            if ("SELF_TRANSFER".equals(transaction.getTransactionType())) {
                if (transaction.getToAccountId() == null) {
                    logger.error("To account ID is required for self-transfer");
                    return ResponseEntity.badRequest().body("To account ID is required for self-transfer");
                }
                toAccount = accountRepo.findById(transaction.getToAccountId()).orElse(null);
                if (toAccount == null) {
                    logger.error("Invalid destination account ID: {}", transaction.getToAccountId());
                    return ResponseEntity.badRequest().body("Invalid destination account ID");
                }
                if (!fromAccount.getUser().getId().equals(toAccount.getUser().getId()) || !fromAccount.getUser().getId().equals(transaction.getUserId())) {
                    logger.error("Accounts do not belong to the same user");
                    return ResponseEntity.badRequest().body("Both accounts must belong to the same user");
                }
                fromAccount.setBalance(fromAccount.getBalance() - transaction.getAmount());
                toAccount.setBalance(toAccount.getBalance() + transaction.getAmount());
                accountRepo.saveAndFlush(fromAccount);
                accountRepo.saveAndFlush(toAccount);
                logger.info("Self-transfer completed: From {} to {}, Amount: {}", fromAccount.getId(), toAccount.getId(), transaction.getAmount());
            } else if ("TRANSFER_TO_OTHERS".equals(transaction.getTransactionType())) {
                if (transaction.getToAccountId() == null) {
                    logger.error("To account ID is required for transfer to others");
                    return ResponseEntity.badRequest().body("To account ID is required for transfer to others");
                }
                toAccount = accountRepo.findById(transaction.getToAccountId()).orElse(null);
                if (toAccount == null) {
                    logger.error("Invalid destination account ID: {}", transaction.getToAccountId());
                    return ResponseEntity.badRequest().body("Invalid destination account ID");
                }
                fromAccount.setBalance(fromAccount.getBalance() - transaction.getAmount());
                toAccount.setBalance(toAccount.getBalance() + transaction.getAmount());
                accountRepo.saveAndFlush(fromAccount);
                accountRepo.saveAndFlush(toAccount);
                logger.info("Transfer to others completed: From {} to {}, Amount: {}", fromAccount.getId(), toAccount.getId(), transaction.getAmount());
            } else if ("UPI".equals(transaction.getTransactionType())) {
                if (transaction.getUpiId() == null) {
                    logger.error("UPI ID is required for UPI transaction");
                    return ResponseEntity.badRequest().body("UPI ID is required for UPI transaction");
                }
                fromAccount.setBalance(fromAccount.getBalance() - transaction.getAmount());
                accountRepo.saveAndFlush(fromAccount);
                logger.info("UPI transaction completed: From {}, Amount: {}", fromAccount.getId(), transaction.getAmount());
            } else {
                logger.error("Unsupported transaction type: {}", transaction.getTransactionType());
                return ResponseEntity.badRequest().body("Unsupported transaction type");
            }

            transactionHistoryRepo.saveAndFlush(transaction);
            logger.info("Transaction history saved: ID {}", transaction.getId());
        } catch (Exception e) {
            logger.error("Transaction failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Transaction failed: " + e.getMessage());
        }

        return ResponseEntity.ok("Transaction recorded successfully");
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
}
