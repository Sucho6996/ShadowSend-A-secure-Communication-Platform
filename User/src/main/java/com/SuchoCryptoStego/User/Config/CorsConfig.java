package com.SuchoCryptoStego.User.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer CorsConfig() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping
                                ("/user/**") // Allow all endpoints
                        .allowedOrigins("http://localhost:3000") // Replace with your frontend URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow HTTP methods
                        .allowedHeaders("Authorization", "Content-Type", "Accept") // Allow headers
                        .allowCredentials(true); // Allow cookies and credentials
            }
        };
    }
}

