package com.mobilebanking.bankapp.model;

import jakarta.persistence.*;

@Entity
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private String bankName;
    private String bankCode; // New field
    private double balance;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Constructors
    public BankAccount() {}

    public BankAccount(String accountNumber, String bankName, String bankCode, User user) {
        this.accountNumber = accountNumber;
        this.bankName = bankName;
        this.bankCode = bankCode;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getBankCode() { return bankCode; }
    public void setBankCode(String bankCode) { this.bankCode = bankCode; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
}