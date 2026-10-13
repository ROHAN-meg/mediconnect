package com.mediconnect.service;

import com.mediconnect.dto.LoginRequestDto;
import com.mediconnect.dto.RegisterRequestDto;
import com.mediconnect.dto.UserResponseDto;
import com.mediconnect.entity.Patient;
import com.mediconnect.entity.User;
import com.mediconnect.entity.UserRole;
import com.mediconnect.entity.UserStatus;
import com.mediconnect.exception.DuplicateResourceException;
import com.mediconnect.exception.ResourceNotFoundException;
import com.mediconnect.repository.PatientRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    public AuthService(UserRepository userRepository, PatientRepository patientRepository) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public UserResponseDto register(RegisterRequestDto dto) {
        String cleanEmail = dto.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(cleanEmail) || patientRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("An account with email '" + cleanEmail + "' already exists.");
        }

        String roleStr = dto.getRole().trim().toUpperCase();
        if ("ADMIN".equals(roleStr)) {
            throw new IllegalArgumentException("Admin account cannot be created via public registration.");
        }

        User user = new User();
        user.setFullName(dto.getFullName().trim());
        user.setEmail(cleanEmail);
        user.setPhone(dto.getPhone().trim());
        user.setPassword(dto.getPassword().trim());

        if ("HOSPITAL_MANAGER".equals(roleStr) || "MANAGER".equals(roleStr)) {
            user.setRole(UserRole.HOSPITAL_MANAGER);
            user.setStatus(UserStatus.PENDING); // MUST NOT be created directly as approved!

            if (dto.getHospitalName() == null || dto.getHospitalName().trim().isEmpty()) {
                throw new IllegalArgumentException("Hospital name is required for Hospital Manager registration.");
            }
            user.setHospitalName(dto.getHospitalName().trim());
        } else {
            // Patient is created directly
            user.setRole(UserRole.PATIENT);
            user.setStatus(UserStatus.APPROVED);

            // Synchronize with Patient table
            Patient patient = new Patient();
            patient.setFullName(user.getFullName());
            patient.setEmail(user.getEmail());
            patient.setPhone(user.getPhone());
            patient.setPassword(user.getPassword());
            patientRepository.save(patient);
        }

        User savedUser = userRepository.save(user);
        return UserResponseDto.fromEntity(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponseDto login(LoginRequestDto dto) {
        String cleanEmail = dto.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email '" + cleanEmail + "'. Please check your credentials."));

        if (!user.getPassword().equals(dto.getPassword().trim())) {
            throw new IllegalArgumentException("Invalid password. Please check your credentials.");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            throw new IllegalArgumentException("Your Hospital Manager account is currently pending approval by the Admin. Please wait for the admin to approve your account.");
        }

        if (user.getStatus() == UserStatus.REJECTED) {
            throw new IllegalArgumentException("Your registration request was rejected by the Admin.");
        }

        return UserResponseDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + cleanEmail));
        return UserResponseDto.fromEntity(user);
    }
}
