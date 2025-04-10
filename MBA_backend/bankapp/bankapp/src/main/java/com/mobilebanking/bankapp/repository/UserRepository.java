// src/main/java/com/mobilebanking/bankapp/repository/UserRepository.java
package com.mobilebanking.bankapp.repository;

import com.mobilebanking.bankapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email); // Changed from findByName
}