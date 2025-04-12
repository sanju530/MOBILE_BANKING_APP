// src/main/java/com/mobilebanking/bankapp/model/LoginResponse.java
package com.mobilebanking.bankapp.model;

public class LoginResponse {
    private String token;
    private String name;
    private Long userId;

    public LoginResponse(String token, String name, Long userId) {
        this.token = token;
        this.name = name;
        this.userId = userId; // Now correctly assigns the parameter
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }

    public Long getUserId() {
        return userId;
    }

    // Setters (optional, if needed)
    public void setToken(String token) {
        this.token = token;
    }

    public void setName(String name) {
        this.name = name;
    }
}