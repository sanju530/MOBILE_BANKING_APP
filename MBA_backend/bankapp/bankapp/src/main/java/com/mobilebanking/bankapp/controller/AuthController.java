package com.mobilebanking.bankapp.controller;

import com.mobilebanking.bankapp.service.AuthService;
import com.mobilebanking.bankapp.model.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;


@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        String result = authService.signup(
                request.getName(),
                request.getPassword(),
                request.getEmail(),
                request.getContactNumber(),
                request.getAddress(),
                request.getDob()
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}


class SignupRequest {
    private String name;
    private String password;
    private String email;
    private String contactNumber;
    private String address;
    private Date dob;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }
}



class LoginRequest {
    private String email, password;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}