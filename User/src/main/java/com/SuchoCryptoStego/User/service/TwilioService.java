package com.SuchoCryptoStego.User.service;

import com.SuchoCryptoStego.User.Config.TwilioConfig;
import com.SuchoCryptoStego.User.model.Users;
import com.SuchoCryptoStego.User.model.VerifyUser;
import com.SuchoCryptoStego.User.repo.UserRepo;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class TwilioService {
    @Autowired
    TwilioConfig twilioConfig;
    @Autowired
    UserRepo userRepo;
    Map<String,String> otpMap=new HashMap<>();
    private BCryptPasswordEncoder encoder= new BCryptPasswordEncoder(12);

    private String generateOTP() {
        return new DecimalFormat("000000")
                .format(new Random().nextInt(999999));
    }

    public ResponseEntity<Map<String, String>> sendOtp(String phNo) {
        Map<String,String> response = new HashMap<>();
        StringBuilder num= new StringBuilder("+91" + phNo);
        try {
            PhoneNumber to=new PhoneNumber(num.toString());
            PhoneNumber from=new PhoneNumber(twilioConfig.getTrialNumber());
            String otp=generateOTP();
            String otpMassege="Dear Customer , Your OTP is ##" + otp + "##. Use this Passcode to complete your verification.Thank You.";

            Message message=Message.creator(to,from,otpMassege).create();
            otpMap.put(phNo,otp);
            response.put("Message","Successfully sent");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("Message",e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.METHOD_FAILURE);
        }

    }

    public ResponseEntity<Map<String, String>> verifyOtp(VerifyUser verifyUser) {
        Map<String,String> response = new HashMap<>();
        try {
            if (verifyUser.getOtp().equals(otpMap.get(verifyUser.getPhNo()))){
                response.put("Message","Valid otp");
                otpMap.replace(verifyUser.getPhNo(), "verified");
                return new ResponseEntity<>(response,HttpStatus.OK);
            }
            else {
                response.put("Message","Invalid Otp");
                return new ResponseEntity<>(response,HttpStatus.NOT_ACCEPTABLE);
            }
        }catch (Exception e){
            response.put("Message",e.getMessage());
            return new ResponseEntity<>(response,HttpStatus.NOT_ACCEPTABLE);
        }
    }
    public ResponseEntity<Map<String, String>> resetPass(VerifyUser verifyUser) {
        Map<String,String> response=new HashMap<>();
        try {
            if (otpMap.get(verifyUser.getPhNo()).equals("verified")){
                otpMap.remove(verifyUser.getPhNo());
                Users user=userRepo.findByphNo(verifyUser.getPhNo());
                user.setPassword(encoder.encode(verifyUser.getOtp()));
                userRepo.save(user);
                response.put("Message","Password Changed Successfully");
                return new ResponseEntity<>(response,HttpStatus.OK);
            }
            else{
                response.put("Message","Something is not right!!!");
                return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
            }
        }catch (Exception e){
            response.put("Message",e.getMessage());
            return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
        }
    }
}
