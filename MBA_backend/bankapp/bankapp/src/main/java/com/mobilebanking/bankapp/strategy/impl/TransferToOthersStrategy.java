package com.mobilebanking.bankapp.strategy.impl;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.model.TransactionHistory;
import com.mobilebanking.bankapp.payload.TransactionRequest;
import com.mobilebanking.bankapp.strategy.TransactionStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TransferToOthersStrategy implements TransactionStrategy {
    private static final Logger logger = LoggerFactory.getLogger(TransferToOthersStrategy.class);

    @Override
    public void processTransaction(TransactionHistory transaction, BankAccount fromAccount, BankAccount toAccount, TransactionRequest request) {
        if (toAccount == null || transaction.getToAccountId() == null) {
            logger.error("To account ID is required for transfer to others");
            throw new IllegalArgumentException("To account ID is required for transfer to others");
        }
        fromAccount.setBalance(fromAccount.getBalance() - request.getAmount());
        toAccount.setBalance(toAccount.getBalance() + request.getAmount());
        logger.info("Transfer to others completed: From {} to {}, Amount: {}", fromAccount.getId(), toAccount.getId(), request.getAmount());
    }
}