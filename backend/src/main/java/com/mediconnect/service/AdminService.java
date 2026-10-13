package com.mediconnect.service;

import com.mediconnect.dto.AdminStatsDto;
import com.mediconnect.dto.UserResponseDto;
import com.mediconnect.entity.User;
import com.mediconnect.entity.UserRole;
import com.mediconnect.entity.UserStatus;
import com.mediconnect.exception.ResourceNotFoundException;
import com.mediconnect.repository.AppointmentRequestRepository;
import com.mediconnect.repository.HospitalRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final AppointmentRequestRepository appointmentRequestRepository;

    public AdminService(UserRepository userRepository,
                        HospitalRepository hospitalRepository,
                        AppointmentRequestRepository appointmentRequestRepository) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.appointmentRequestRepository = appointmentRequestRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getPendingManagers() {
        return userRepository.findByRoleAndStatus(UserRole.HOSPITAL_MANAGER, UserStatus.PENDING)
                .stream()
                .map(UserResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDto approveManager(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + id));

        if (user.getRole() != UserRole.HOSPITAL_MANAGER) {
            throw new IllegalArgumentException("User with ID " + id + " is not a Hospital Manager.");
        }

        user.setStatus(UserStatus.APPROVED);
        User updated = userRepository.save(user);
        return UserResponseDto.fromEntity(updated);
    }

    @Transactional
    public UserResponseDto rejectManager(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + id));

        if (user.getRole() != UserRole.HOSPITAL_MANAGER) {
            throw new IllegalArgumentException("User with ID " + id + " is not a Hospital Manager.");
        }

        user.setStatus(UserStatus.REJECTED);
        User updated = userRepository.save(user);
        return UserResponseDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(UserResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        long totalUsers = userRepository.count();
        long totalPatients = userRepository.countByRole(UserRole.PATIENT);
        long pendingManagers = userRepository.countByRoleAndStatus(UserRole.HOSPITAL_MANAGER, UserStatus.PENDING);
        long approvedManagers = userRepository.countByRoleAndStatus(UserRole.HOSPITAL_MANAGER, UserStatus.APPROVED);
        long totalHospitals = hospitalRepository.count();
        long totalAppointments = appointmentRequestRepository.count();

        return new AdminStatsDto(totalUsers, totalPatients, pendingManagers, approvedManagers, totalHospitals, totalAppointments);
    }
}
