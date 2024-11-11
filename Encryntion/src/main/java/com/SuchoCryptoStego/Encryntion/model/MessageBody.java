package com.SuchoCryptoStego.Encryntion.model;

import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class MessageBody {
    String rph;
    String message;
    String key;
    //For Image
    private String imageName;
    private String imageType;
    @Lob
    private byte[] image;
}
