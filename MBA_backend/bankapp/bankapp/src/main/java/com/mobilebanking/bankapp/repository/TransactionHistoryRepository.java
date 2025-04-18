package com.mobilebanking.bankapp.repository;

import com.mobilebanking.bankapp.model.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
}