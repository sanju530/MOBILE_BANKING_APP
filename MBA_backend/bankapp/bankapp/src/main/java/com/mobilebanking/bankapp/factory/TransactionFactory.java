package com.mobilebanking.bankapp.factory;

import com.mobilebanking.bankapp.model.BankAccount;
import com.mobilebanking.bankapp.model.Billing;
import com.mobilebanking.bankapp.model.TransactionHistory;
import com.mobilebanking.bankapp.payload.TransactionRequest;
import java.time.LocalDateTime;

public class TransactionFactory {

    public static TransactionHistory createTransaction(TransactionRequest request, BankAccount fromAccount, BankAccount toAccount) {
        TransactionHistory transaction = new TransactionHistory();
        transaction.setUserId(request.getUserId());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType(request.getTransactionType());
        transaction.setStatus("COMPLETED");
        transaction.setFromAccountId(fromAccount != null ? fromAccount.getId() : null);
        transaction.setToAccountId(toAccount != null ? toAccount.getId() : null);
        transaction.setCreatedAt(LocalDateTime.now());
        return transaction;
    }

    public static Billing createBilling(TransactionHistory transaction, TransactionRequest request) {
        if (!"BILL_PAYMENT".equals(request.getTransactionType())) {
            return null;
        }
        Billing billing = new Billing();
        billing.setTransactionId(transaction.getId());
        billing.setBillingType(request.getBillingType());
        billing.setAmount(request.getAmount());
        if ("ELECTRICITY".equals(request.getBillingType())) {
            billing.setCustomerId(request.getCustomerId());
        } else if ("RENT".equals(request.getBillingType())) {
            billing.setPropertyName(request.getPropertyName());
        } else if ("WATER".equals(request.getBillingType())) {
            billing.setRrNumber(request.getRrNumber());
        }
        return billing;
    }

    public static TransactionHistory createUpiTransaction(TransactionRequest request, BankAccount fromAccount) {
        TransactionHistory transaction = createTransaction(request, fromAccount, null);
        transaction.setUpiId(request.getUpiId());
        return transaction;
    }
}