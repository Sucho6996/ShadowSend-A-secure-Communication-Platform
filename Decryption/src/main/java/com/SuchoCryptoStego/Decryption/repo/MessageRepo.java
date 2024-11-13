package com.SuchoCryptoStego.Decryption.repo;



import com.SuchoCryptoStego.Decryption.model.Message;
import com.SuchoCryptoStego.Decryption.model.UserView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message,Integer> {
    List<Message> findAllByreceiverNumber(String rph);

    @Query
    ("SELECT m from Message m WHERE " +"LOWER(m.senderNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "+
     "LOWER(m.senderName) LIKE LOWER(CONCAT('%', :keyword, '%'))"
    )
    List<Message> findByKeyword(String keyword);


    @Query("SELECT m FROM Message m WHERE m.receiverNumber = :receiverNumber ORDER BY m.id ASC")
    List<Message> findSixByReceiverNumber(@Param("receiverNumber") String receiverNumber, Pageable pageable);

}
