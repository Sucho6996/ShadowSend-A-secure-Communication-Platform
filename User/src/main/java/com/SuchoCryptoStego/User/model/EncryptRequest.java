package com.SuchoCryptoStego.User.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class EncryptRequest {
    private String token;
    private Message message;
    private MultipartFile imageFile;

}

