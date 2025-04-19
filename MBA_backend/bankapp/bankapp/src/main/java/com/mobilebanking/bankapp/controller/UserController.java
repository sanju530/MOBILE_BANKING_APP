// src/main/java/com/mobilebanking/bankapp/controller/UserController.java
package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.model.User;
import com.mobilebanking.bankapp.model.UserDTO;
import com.mobilebanking.bankapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        UserDTO userDTO = new UserDTO(user);
        return ResponseEntity.ok(userDTO);
    }
}