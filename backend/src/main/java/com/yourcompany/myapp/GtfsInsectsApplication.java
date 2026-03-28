package com.yourcompany.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class GtfsInsectsApplication {

	public static void main(String[] args) {
		SpringApplication.run(GtfsInsectsApplication.class, args);
	}

}
