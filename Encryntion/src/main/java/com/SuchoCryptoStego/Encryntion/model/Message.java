package com.SuchoCryptoStego.Encryntion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int messageId;
    private String senderNumber;
    private String senderName;
    private String receiverNumber;
    private String message;
    private String timestamp;
    //For Image
    private String imageName;
    private String imageType;
    @Lob
    private byte[] image;
}
