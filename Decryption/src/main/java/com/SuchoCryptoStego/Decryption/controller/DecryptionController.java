package com.SuchoCryptoStego.Decryption.controller;


import com.SuchoCryptoStego.Decryption.model.DMessageBody;
import com.SuchoCryptoStego.Decryption.model.UserView;
import com.SuchoCryptoStego.Decryption.service.DecryptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dec")
public class DecryptionController {

    @Autowired
    DecryptService service;
    @GetMapping("/findAll/{rph}")
    public ResponseEntity<List<UserView>> findAll(@PathVariable String rph){
        return service.findAll(rph);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<UserView> getMessage(@PathVariable int id){
        return service.get(id);
    }

    @PostMapping("/decrypt")
    public ResponseEntity<String> decryption
            (@RequestParam int id, @RequestBody DMessageBody messageBody){
        return service.decryption(id,messageBody);
    }

}
