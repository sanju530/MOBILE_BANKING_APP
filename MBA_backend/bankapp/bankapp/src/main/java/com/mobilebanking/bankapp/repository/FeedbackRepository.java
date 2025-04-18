package com.mobilebanking.bankapp.repository;

import com.mobilebanking.bankapp.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}