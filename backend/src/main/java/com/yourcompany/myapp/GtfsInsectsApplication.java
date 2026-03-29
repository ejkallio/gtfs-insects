package com.yourcompany.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
@EnableScheduling
public class GtfsInsectsApplication {

	public static void main(String[] args) {
		SpringApplication.run(GtfsInsectsApplication.class, args);
	}

}
