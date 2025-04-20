package com.mobilebanking.bankapp.strategy.impl;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.model.TransactionHistory;
import com.mobilebanking.bankapp.payload.TransactionRequest;
import com.mobilebanking.bankapp.strategy.TransactionStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UpiStrategy implements TransactionStrategy {
    private static final Logger logger = LoggerFactory.getLogger(UpiStrategy.class);

    @Override
    public void processTransaction(TransactionHistory transaction, BankAccount fromAccount, BankAccount toAccount, TransactionRequest request) {
        if (request.getUpiId() == null) {
            logger.error("UPI ID is required for UPI transaction");
            throw new IllegalArgumentException("UPI ID is required for UPI transaction");
        }
        fromAccount.setBalance(fromAccount.getBalance() - request.getAmount());
        logger.info("UPI transaction completed: From {}, Amount: {}, UPI ID: {}", fromAccount.getId(), request.getAmount(), request.getUpiId());
    }
}