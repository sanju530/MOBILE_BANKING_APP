package com.mobilebanking.bankapp.strategy.impl;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.model.TransactionHistory;
import com.mobilebanking.bankapp.payload.TransactionRequest;
import com.mobilebanking.bankapp.strategy.TransactionStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BillPaymentStrategy implements TransactionStrategy {
    private static final Logger logger = LoggerFactory.getLogger(BillPaymentStrategy.class);

    @Override
    public void processTransaction(TransactionHistory transaction, BankAccount fromAccount, BankAccount toAccount, TransactionRequest request) {
        if (request.getBillingType() == null) {
            logger.error("Billing type is required for bill payment");
            throw new IllegalArgumentException("Billing type is required");
        }
        fromAccount.setBalance(fromAccount.getBalance() - request.getAmount());
        logger.info("Bill payment completed: From {}, Amount: {}", fromAccount.getId(), request.getAmount());
    }
}