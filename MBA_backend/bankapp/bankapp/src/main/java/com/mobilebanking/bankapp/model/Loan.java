package com.mobilebanking.bankapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "loan")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")  // Foreign key to the User entity
    private User user;

    @ManyToOne
    @JoinColumn(name = "account_id")  // Foreign key to the BankAccount entity
    private BankAccount account;  // Reference to the BankAccount entity

    private double amount;
    private double interestRate;
    private int termInMonths;

    private String terms;  // Field for loan terms

    @Column(name = "loan_type")  // New field for loan type
    private String loanType;

    // Constructors
    public Loan() {}

    public Loan(Long id, User user, BankAccount account, double amount, double interestRate, int termInMonths, String loanType) {
        this.id = id;
        this.user = user;
        this.account = account;
        this.amount = amount;
        this.interestRate = interestRate;
        this.termInMonths = termInMonths;
        this.loanType = loanType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BankAccount getAccount() { return account; }
    public void setAccount(BankAccount account) { this.account = account; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public double getInterestRate() { return interestRate; }
    public void setInterestRate(double interestRate) { this.interestRate = interestRate; }

    public int getTermInMonths() { return termInMonths; }
    public void setTermInMonths(int termInMonths) { this.termInMonths = termInMonths; }

    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }
}