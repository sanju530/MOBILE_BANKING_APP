// src/main/java/com/mobilebanking/bankapp/model/LoginResponse.java
package com.mobilebanking.bankapp.model;

public class LoginResponse {
    private String token;
    private String name;

    public LoginResponse(String token, String name) {
        this.token = token;
        this.name = name;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getName() {
        return name;
    }

    // Setters (optional, if needed)
    public void setToken(String token) {
        this.token = token;
    }

    public void setName(String name) {
        this.name = name;
    }
}