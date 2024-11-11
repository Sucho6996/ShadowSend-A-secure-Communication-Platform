package com.SuchoCryptoStego.User.service;




import com.SuchoCryptoStego.User.model.UserPrinciple;
import com.SuchoCryptoStego.User.model.Users;
import com.SuchoCryptoStego.User.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepo repo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user =repo.findByphNo(username);
        if (user==null){
            System.out.println("404 not found");
            throw new UsernameNotFoundException("Username 404");
        }
        return new UserPrinciple(user);
    }
}