package com.SuchoCryptoStego.Encryntion.service;

import org.springframework.stereotype.Service;

@Service
public class EncryptionAlgo {


    public String keyGen(String message, String password) {
        if (message == null || password == null || message.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("Message and password cannot be empty");
        }
        StringBuffer str = new StringBuffer(password);
        if (message.length() > password.length()) {
            int i = 0;
            while (message.length() > password.length()) {
                password += password.charAt(i);
                i++;
            }
            return password;
        } else if (password.length() > message.length()) {
            int i = password.length() - 1;
            for (int j = 0; j < message.length(); j++) {
                str.setCharAt(j, str.charAt(i));
            }
            password = str.toString();
        }
        return password;
    }
    public String encryption(String message, String password) {
        if (message == null || password == null || message.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("Something Went Wrong!!!");
        }
        String key = keyGen(message, password);
        StringBuffer chiperText = new StringBuffer(message);
        for (int i = 0; i < message.length(); i++) {
            int mAscii = message.charAt(i);
            int kAscii = key.charAt(i);
            int cAscii = ((mAscii + kAscii) % 128) + 32;
            char c = (char) cAscii;
            chiperText.setCharAt(i, c);
        }
        return chiperText.toString();
    }
}
