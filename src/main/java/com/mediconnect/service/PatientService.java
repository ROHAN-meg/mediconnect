package com.mediconnect.service;

import com.mediconnect.dto.PatientRegistrationDto;
import com.mediconnect.entity.Patient;
import com.mediconnect.exception.DuplicateResourceException;
import com.mediconnect.exception.ResourceNotFoundException;
import com.mediconnect.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional
    public Patient registerPatient(PatientRegistrationDto dto) {
        String cleanEmail = dto.getEmail().trim().toLowerCase();
        if (patientRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("A patient with email '" + cleanEmail + "' is already registered.");
        }

        Patient patient = new Patient();
        patient.setFullName(dto.getFullName().trim());
        patient.setEmail(cleanEmail);
        patient.setPhone(dto.getPhone().trim());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            patient.setPassword(dto.getPassword().trim());
        }

        return patientRepository.save(patient);
    }

    @Transactional(readOnly = true)
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Patient getPatientByEmail(String email) {
        return patientRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
    }

    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
}
