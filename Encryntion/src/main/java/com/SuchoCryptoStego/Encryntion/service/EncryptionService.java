package com.SuchoCryptoStego.Encryntion.service;

import com.SuchoCryptoStego.Encryntion.model.Message;
import com.SuchoCryptoStego.Encryntion.model.MessageBody;
import com.SuchoCryptoStego.Encryntion.repo.MessageRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class EncryptionService {

    @Autowired
    EncryptionAlgo algo;
    @Autowired
    SteganographyService steganographyService;
    @Autowired
    MessageRepo messageRepo;

    @Transactional
    public ResponseEntity<String> encrypt(String sph, MessageBody message) {
        String chipperText=algo.encryption(message.getMessage(), message.getKey());
        byte[] stegoImage= new byte[0];
        try {
            stegoImage = steganographyService.embedMessage(message.getImage(), chipperText);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NO_CONTENT);
        }
        Message message1=new Message();
        message1.setMessage(chipperText);
        message1.setReceiverNumber(message.getRph());
        message1.setSenderNumber(sph);
        message1.setImageName(message.getImageName());
        message1.setImageType(message.getImageType());
        message1.setImage(stegoImage);
        messageRepo.save(message1);
        return new ResponseEntity<>("Succesfylly Sent!!!", HttpStatus.OK);
    }
}
