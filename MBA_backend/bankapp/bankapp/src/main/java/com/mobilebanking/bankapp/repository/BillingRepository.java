package com.mobilebanking.bankapp.repository;

import com.mobilebanking.bankapp.model.Billing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillingRepository extends JpaRepository<Billing, Long> {
}