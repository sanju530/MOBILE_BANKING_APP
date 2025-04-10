package com.mobilebanking.bankapp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.mobilebanking.bankapp.model.Loan;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    Optional<Loan> findByAccountId(Long accountId);
}
