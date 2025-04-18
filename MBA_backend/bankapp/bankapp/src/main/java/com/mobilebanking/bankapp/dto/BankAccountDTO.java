package com.mobilebanking.bankapp.dto;

public class BankAccountDTO {
    private Long id;
    private String accountNumber;
    private Double balance;
    private String bankCode;
    private String bankName;

    public BankAccountDTO(Long id, String accountNumber, Double balance, String bankCode, String bankName) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.bankCode = bankCode;
        this.bankName = bankName;
    }

    // Getters
    public Long getId() { return id; }
    public String getAccountNumber() { return accountNumber; }
    public Double getBalance() { return balance; }
    public String getBankCode() { return bankCode; }
    public String getBankName() { return bankName; }
}