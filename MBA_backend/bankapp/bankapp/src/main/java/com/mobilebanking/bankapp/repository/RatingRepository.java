package com.mobilebanking.bankapp.repository;

import com.mobilebanking.bankapp.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
}