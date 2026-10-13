package com.mediconnect.repository;

import com.mediconnect.entity.User;
import com.mediconnect.entity.UserRole;
import com.mediconnect.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByRoleAndStatus(UserRole role, UserStatus status);

    List<User> findAllByOrderByCreatedAtDesc();

    long countByRole(UserRole role);

    long countByRoleAndStatus(UserRole role, UserStatus status);
}
