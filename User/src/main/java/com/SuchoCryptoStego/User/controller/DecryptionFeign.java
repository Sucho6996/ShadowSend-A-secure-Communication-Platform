package com.SuchoCryptoStego.User.controller;



import com.SuchoCryptoStego.User.model.DMessageBody;
import com.SuchoCryptoStego.User.model.UserView;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient("DECRYPTION")
public interface DecryptionFeign {

    @GetMapping("/dec/findAll/{rph}")
    public ResponseEntity<List<UserView>> findAll(@PathVariable String rph);

    @GetMapping("/dec/get/{id}")
    public ResponseEntity<UserView> getMessage(@PathVariable int id);

    @GetMapping("/dec/search/{keyword}")
    public ResponseEntity<List<UserView>> search(@PathVariable String keyword);

    @PostMapping("/dec/decrypt")
    public ResponseEntity<String> decryption
            (@RequestParam int id, @RequestBody DMessageBody messageBody);
}
