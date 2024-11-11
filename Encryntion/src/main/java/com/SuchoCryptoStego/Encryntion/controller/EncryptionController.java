package com.SuchoCryptoStego.Encryntion.controller;


import com.SuchoCryptoStego.Encryntion.model.Message;
import com.SuchoCryptoStego.Encryntion.model.MessageBody;
import com.SuchoCryptoStego.Encryntion.service.EncryptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/enc")
public class EncryptionController {

    @Autowired
    EncryptionService service;
    @PostMapping("/encrypt")
    public ResponseEntity<String> encrypt(@RequestParam("sph") String sph, @RequestBody MessageBody message){
        return service.encrypt(sph,message);
    }


}
