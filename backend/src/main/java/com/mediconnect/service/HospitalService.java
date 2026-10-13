package com.mediconnect.service;

import com.mediconnect.entity.Hospital;
import com.mediconnect.exception.ResourceNotFoundException;
import com.mediconnect.repository.HospitalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @Transactional(readOnly = true)
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Hospital> searchHospitals(String query, String location, String department) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanLocation = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        String cleanDepartment = (department != null && !department.trim().isEmpty()) ? department.trim() : null;

        return hospitalRepository.searchHospitals(cleanQuery, cleanLocation, cleanDepartment);
    }
}
