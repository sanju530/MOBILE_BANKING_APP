package com.mobilebanking.bankapp.dto;

import java.time.LocalDateTime;

public class TransactionHistoryDTO {
    private Long id;
    private String transactionType;
    private Long fromAccountId;
    private Long toAccountId;
    private Double amount;
    private String upiId;
    private String status;
    private LocalDateTime createdAt;

    public TransactionHistoryDTO(Long id, String transactionType, Long fromAccountId, Long toAccountId, Double amount, String upiId, String status, LocalDateTime createdAt) {
        this.id = id;
        this.transactionType = transactionType;
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
        this.upiId = upiId;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public String getTransactionType() { return transactionType; }
    public Long getFromAccountId() { return fromAccountId; }
    public Long getToAccountId() { return toAccountId; }
    public Double getAmount() { return amount; }
    public String getUpiId() { return upiId; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}