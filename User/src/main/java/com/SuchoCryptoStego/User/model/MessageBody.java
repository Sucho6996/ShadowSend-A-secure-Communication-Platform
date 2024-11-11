package com.SuchoCryptoStego.User.model;

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
    private String rph;
    private String message;
    private String senderName;
    private String key;
    //For Image
    private String imageName;
    private String imageType;
    @Lob
    private byte[] image;
}
