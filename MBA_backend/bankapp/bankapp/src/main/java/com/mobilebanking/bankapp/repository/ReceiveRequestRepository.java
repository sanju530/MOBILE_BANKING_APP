package com.mobilebanking.bankapp.repository;

import com.mobilebanking.bankapp.model.ReceiveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiveRequestRepository extends JpaRepository<ReceiveRequest, Long> {
}