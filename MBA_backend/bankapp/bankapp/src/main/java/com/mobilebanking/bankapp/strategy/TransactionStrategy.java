package com.mobilebanking.bankapp.strategy;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.model.TransactionHistory;
import com.mobilebanking.bankapp.payload.TransactionRequest;

public interface TransactionStrategy {
    void processTransaction(TransactionHistory transaction, BankAccount fromAccount, BankAccount toAccount, TransactionRequest request);
}