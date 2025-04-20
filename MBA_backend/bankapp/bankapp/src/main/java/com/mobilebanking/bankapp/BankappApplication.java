package com.mobilebanking.bankapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.mobilebanking.bankapp.controller", "com.mobilebanking.bankapp.strategy", "com.mobilebanking.bankapp.service"})
public class BankappApplication {
	public static void main(String[] args) {
		SpringApplication.run(BankappApplication.class, args);
	}
}