package com.mobilebanking.bankapp.strategy.impl;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.model.TransactionHistory;
import com.mobilebanking.bankapp.payload.TransactionRequest;
import com.mobilebanking.bankapp.strategy.TransactionStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SelfTransferStrategy implements TransactionStrategy {
    private static final Logger logger = LoggerFactory.getLogger(SelfTransferStrategy.class);

    @Override
    public void processTransaction(TransactionHistory transaction, BankAccount fromAccount, BankAccount toAccount, TransactionRequest request) {
        if (toAccount == null || transaction.getToAccountId() == null) {
            logger.error("To account ID is required for self-transfer");
            throw new IllegalArgumentException("To account ID is required for self-transfer");
        }
        if (!fromAccount.getUser().getId().equals(toAccount.getUser().getId()) || !fromAccount.getUser().getId().equals(transaction.getUserId())) {
            logger.error("Accounts do not belong to the same user for self-transfer");
            throw new IllegalArgumentException("Both accounts must belong to the same user for self-transfer");
        }
        fromAccount.setBalance(fromAccount.getBalance() - request.getAmount());
        toAccount.setBalance(toAccount.getBalance() + request.getAmount());
        logger.info("Self-transfer completed: From {} to {}, Amount: {}", fromAccount.getId(), toAccount.getId(), request.getAmount());
    }
}