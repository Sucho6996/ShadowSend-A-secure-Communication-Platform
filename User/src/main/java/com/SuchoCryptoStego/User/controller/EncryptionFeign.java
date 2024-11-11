package com.SuchoCryptoStego.User.controller;

import com.SuchoCryptoStego.User.model.MessageBody;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@FeignClient("ENCRYPTION")
public interface EncryptionFeign {
    @PostMapping("/enc/encrypt")
    public ResponseEntity<String> encrypt
            (@RequestParam("sph") String sph, @RequestBody MessageBody message);
}
