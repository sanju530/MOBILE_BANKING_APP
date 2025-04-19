// src/main/java/com/mobilebanking/bankapp/model/UserDTO.java
package com.mobilebanking.bankapp.model;

import java.util.Date;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String contactNumber;
    private String address;
    private Date dob;

    // Constructors
    public UserDTO() {}

    public UserDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.contactNumber = user.getContactNumber();
        this.address = user.getAddress();
        this.dob = user.getDob();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Date getDob() { return dob; }
    public void setDob(Date dob) { this.dob = dob; }
}