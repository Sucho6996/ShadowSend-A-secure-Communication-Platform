package com.SuchoCryptoStego.User.repo;

import com.SuchoCryptoStego.User.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users,String> {
    Users findAllByphNo(String phNo);

    Users findByphNo(String username);
}
