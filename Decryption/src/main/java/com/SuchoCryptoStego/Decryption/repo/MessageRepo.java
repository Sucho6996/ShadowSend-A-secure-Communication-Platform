package com.SuchoCryptoStego.Decryption.repo;



import com.SuchoCryptoStego.Decryption.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message,Integer> {
    List<Message> findAllByreceiverNumber(String rph);
}
