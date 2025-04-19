package com.mobilebanking.bankapp.repository;

import com.mobilebanking.bankapp.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    @Query("SELECT b FROM BankAccount b WHERE b.accountNumber = :accountNumber")
    Optional<BankAccount> findByAccountNumber(String accountNumber);

    @Query("SELECT b FROM BankAccount b WHERE b.user.id = :userId")
    List<BankAccount> findByUser_Id(Long userId);
}