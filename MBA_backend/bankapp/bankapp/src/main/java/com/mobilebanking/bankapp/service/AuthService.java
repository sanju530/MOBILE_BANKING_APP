package com.mobilebanking.bankapp.service;

import com.mobilebanking.bankapp.model.User;
import com.mobilebanking.bankapp.repository.UserRepository;
import com.mobilebanking.bankapp.model.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;


import java.util.Date;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public String signup(String name, String password, String email,
                         String contactNumber, String address, Date dob) {

        if (userRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(name);
        user.setPassword(password);
        user.setEmail(email);
        user.setContactNumber(contactNumber);
        user.setAddress(address);
        user.setDob(dob);

        userRepository.save(user);
        return "User registered successfully";
    }

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        return new LoginResponse("jwt-token-dummy", user.getName(), user.getId());
    }
}
