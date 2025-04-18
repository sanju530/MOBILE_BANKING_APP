package com.mobilebanking.bankapp.repository;

import com.mobilebanking.bankapp.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    BankAccount findByAccountNumber(String accountNumber);
    List<BankAccount> findByUser_Id(Long userId); // Updated from findByUserId
}