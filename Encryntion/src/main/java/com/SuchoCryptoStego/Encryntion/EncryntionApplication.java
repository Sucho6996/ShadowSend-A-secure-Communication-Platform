package com.SuchoCryptoStego.Encryntion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class EncryntionApplication {

	public static void main(String[] args) {
		SpringApplication.run(EncryntionApplication.class, args);
	}

}
