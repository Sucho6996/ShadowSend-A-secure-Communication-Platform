package com.SuchoCryptoStego.User.controller;


import com.SuchoCryptoStego.User.model.*;
import com.SuchoCryptoStego.User.service.JwtService;
import com.SuchoCryptoStego.User.service.TwilioService;
import com.SuchoCryptoStego.User.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtService jwtService;
    @Autowired
    TwilioService twilioService;
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;

    /*
    This Commented area is for anyone who
    are developing frontend based on this backend
    Welcome to my world here every message is secure and safe
    I'm no Zuckerberg, so there is no way
    to steal data
    */

    //Get the list of unread messages
    @GetMapping("/findAll")
    public ResponseEntity<List<UserView>> findAll
    (@RequestHeader("Authorization") String authHeader){
        String token=authHeader.substring(7);
        return userService.findAll(token);
    }
    @GetMapping("/findfirstsix")
    public ResponseEntity<List<UserView>> findFirstSix
            (@RequestHeader("Authorization") String authHeader){
        String token=authHeader.substring(7);
        return userService.findFirstSix(token);
    }

    //Call this api after user clicking on a particular message
    @GetMapping("/get/{id}")
    public ResponseEntity<UserView> getMessage(@PathVariable int id){
        return userService.get(id);
    }

    //search for messages using phone number or sender name
    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<UserView>> search(@PathVariable String keyword){
        return userService.search(keyword);
    }

    //Call this api when the user click on decrypt
    //This will decrypt the message and delete the whole record from database
    //Deletion is for provide more data security
    @PostMapping("/decrypt")
    public ResponseEntity<Map<String,String>> decryption
    (@RequestParam("id") int id,@RequestHeader("Authorization") String authHeader){
        String token=authHeader.substring(7);
        return userService.decryption(id,token);
    }

    //Whenever the user wants to send message
    // (Create a form for user to provide senders number,message and picture)
    @PostMapping("/encrypt")
    public ResponseEntity<Map<String,String>> encrypt
    (@RequestHeader("Authorization") String authHeader, @RequestPart("message") Message message, @RequestPart("image") MultipartFile imgFile){
        String token=authHeader.substring(7);
        return userService.encryption(token,message,imgFile);
    }

    //For signup
    @PostMapping("/signup")
    public ResponseEntity<Map<String,String>> signUp(@RequestBody Users user){
        return userService.addUser(user);
    }


    //For Login
//    @PostMapping("/login")
//    public ResponseEntity<Map<String,String>> login(@RequestBody Users user){
//        Map<String,String> response=new HashMap<>();
//        Authentication auth=authenticationManager
//                .authenticate(new UsernamePasswordAuthenticationToken(user.getPhNo(),user.getPassword()));
//        if (auth.isAuthenticated()){
//            response.put("message",jwtService.generateToken(user.getPhNo()));
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        }
//        else {
//            response.put("message","Invalid credentials!!!");
//            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
//        }
//    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Users user) {
        Map<String, String> response = new HashMap<>();
        try {
            Authentication auth = authenticationManager.
                    authenticate(new UsernamePasswordAuthenticationToken(user.getPhNo(), user.getPassword())
            );

            // If authentication is successful
            if (auth.isAuthenticated()) {
                response.put("message", jwtService.generateToken(user.getPhNo()));
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        } catch (BadCredentialsException e) {
            // Handle invalid credentials
            response.put("message", "Invalid credentials!!!");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            // Handle other authentication-related exceptions
            response.put("message", "Authentication failed due to an error.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        // Fallback in case of unexpected behavior
        response.put("message", "Authentication process failed.");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String,String>> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Map<String,String> response=new HashMap<>();
        if (jwtService.invalidateToken(token)) {
            response.put("message","Logout successful");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message","Invalid token or already logged out");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    //To get their own data
    @GetMapping("/profile")
    public ResponseEntity<Users> getMyData(@RequestHeader("Authorization") String authHeader){
        String token=authHeader.substring(7);
        return userService.getMyData(token);
    }

    /*For changing the password after login*/
    @PostMapping("/sendOtpSecure")
    public ResponseEntity<Map<String,String>> sendOtpSecure(@RequestHeader("Authorization") String authHeader){
        String token=authHeader.substring(7);
        String phNo= jwtService.extractUserName(token);
        return twilioService.sendOtp(phNo);
    }

    /*Use this for forget password or signup situation*/
    @PostMapping("/sendOtp")
    public ResponseEntity<Map<String,String>> sendOtp(@RequestParam("phNo") String phNo){
        return twilioService.sendOtp(phNo);
    }

    /*After getting the otp successfully user will verify with phNo and otp using this API*/
    @PostMapping("/verify")
    public ResponseEntity<Map<String,String>> verifyOtp(@RequestBody VerifyUser verifyUser){
        return twilioService.verifyOtp(verifyUser);
    }

    /*After getting 201 status from user/verify
    user will provide phNo and password(variable name->otp)
    and this api will be called
    */
    @PutMapping("/resetPassword")
    public ResponseEntity<Map<String,String>> resetPassword(@RequestBody VerifyUser verifyUser){
        return twilioService.resetPass(verifyUser);
    }


    /*
    This is for later update whenever
    it feels like switching from Http to Websocket
    until then just keep your user under a illusion
    */

////    @MessageMapping("/encrypt")
////    public void encryptMessage(@Payload EncryptRequest encryptRequest) {
////        String token = encryptRequest.getToken();
////        Message message = encryptRequest.getMessage();
////        MultipartFile imgFile = encryptRequest.getImageFile();
////
////        messagingTemplate.convertAndSendToUser(
////                message.getRph(),           // Destination user identified by their phone number
////                "/queue/encryptedMessage", // The destination within the user-specific queue
////                userService.encryption(token, message, imgFile).getBody() // The message payload to send
////        );
//    }

}
