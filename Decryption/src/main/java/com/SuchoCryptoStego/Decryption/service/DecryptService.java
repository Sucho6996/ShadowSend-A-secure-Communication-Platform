package com.SuchoCryptoStego.Decryption.service;


import com.SuchoCryptoStego.Decryption.model.Message;
import com.SuchoCryptoStego.Decryption.model.DMessageBody;
import com.SuchoCryptoStego.Decryption.model.UserView;
import com.SuchoCryptoStego.Decryption.repo.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DecryptService {

    @Autowired
    MessageRepo repo;
    @Autowired
    DecryptionAlgo decryptionAlgo;

    public ResponseEntity<String> decryption(int id, DMessageBody messageBody) {

        Message message=repo.findById(id).orElse(new Message());
        if(!messageBody.getRph().equals(message.getReceiverNumber())){
            return new ResponseEntity<>("You Hacker!!!",HttpStatus.BAD_REQUEST);
        }
        String cipherText=message.getMessage();
        String plainText= decryptionAlgo.decryption(cipherText,messageBody.getKey());
        String senderDetails=message.getSenderName()+"(No: "+message.getSenderNumber()+")";
        repo.deleteById(message.getMessageId());
        return new ResponseEntity<>(plainText+"\n"+"- "+senderDetails, HttpStatus.OK);
    }

    public ResponseEntity<List<UserView>> findAll(String rph) {
        List<Message> allMessage=repo.findAllByreceiverNumber(rph);
        List<UserView> userViews=new ArrayList<>();
        if(!allMessage.isEmpty()){
            for (Message m:allMessage){
                UserView userView=new UserView();
                userView.setMessageId(m.getMessageId());
                userView.setSenderName("Anonymous");
                userView.setImage(m.getImage());
                userViews.add(userView);
            }
            return new ResponseEntity<>(userViews, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    public ResponseEntity<UserView> get(int id) {
        Message message=repo.findById(id).get();
        UserView userView=new UserView();
        userView.setMessageId(message.getMessageId());
        userView.setSenderName("Anonymous");
        userView.setSenderNumber(message.getSenderNumber());
        userView.setTimeStamp(message.getTimestamp());
        userView.setImage(message.getImage());
        return new ResponseEntity<>(userView,HttpStatus.OK);
    }

    public ResponseEntity<List<UserView>> search(String keyword) {

        List<Message> message=repo.findByKeyword(keyword);
        List<UserView> userViews=new ArrayList<>();
        if(message.isEmpty()){
            return new ResponseEntity<>(userViews,HttpStatus.NO_CONTENT);
        }
        for (Message m:message){
            UserView userView=new UserView();
            userView.setMessageId(m.getMessageId());
            userView.setSenderName(m.getSenderName());
            userView.setTimeStamp(m.getTimestamp());
            userView.setImage(m.getImage());
            userViews.add(userView);
        }
        return new ResponseEntity<>(userViews,HttpStatus.OK);
    }
}
