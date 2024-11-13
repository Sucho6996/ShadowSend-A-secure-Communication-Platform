package com.SuchoCryptoStego.User.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class UserView{
    private int messageId;
    private String senderNumber;
    private String senderName;
    private String timeStamp;
    @Lob
    private byte[] image;
}
