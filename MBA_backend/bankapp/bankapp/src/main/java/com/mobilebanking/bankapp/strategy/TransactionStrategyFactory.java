package com.mobilebanking.bankapp.strategy;

import com.mobilebanking.bankapp.strategy.impl.BillPaymentStrategy;
import com.mobilebanking.bankapp.strategy.impl.SelfTransferStrategy;
import com.mobilebanking.bankapp.strategy.impl.TransferToOthersStrategy;
import com.mobilebanking.bankapp.strategy.impl.UpiStrategy;
import org.springframework.stereotype.Component;

@Component
public class TransactionStrategyFactory {
    public TransactionStrategy getStrategy(String transactionType) {
        return switch (transactionType) {
            case "SELF_TRANSFER" -> new SelfTransferStrategy();
            case "TRANSFER_TO_OTHERS" -> new TransferToOthersStrategy();
            case "UPI" -> new UpiStrategy();
            case "BILL_PAYMENT" -> new BillPaymentStrategy();
            default -> throw new IllegalArgumentException("Unsupported transaction type: " + transactionType);
        };
    }
}