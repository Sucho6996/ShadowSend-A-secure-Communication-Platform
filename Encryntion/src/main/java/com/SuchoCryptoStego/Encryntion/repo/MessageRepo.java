package com.SuchoCryptoStego.Encryntion.repo;


import com.SuchoCryptoStego.Encryntion.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepo extends JpaRepository<Message,Integer> {
}
