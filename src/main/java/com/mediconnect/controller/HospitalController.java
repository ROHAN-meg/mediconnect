package com.mediconnect.controller;

import com.mediconnect.dto.ApiResponse;
import com.mediconnect.entity.Hospital;
import com.mediconnect.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(originPatterns = "*")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hospital>>> getHospitals(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String department) {

        List<Hospital> hospitals;
        if ((query != null && !query.trim().isEmpty()) ||
            (location != null && !location.trim().isEmpty()) ||
            (department != null && !department.trim().isEmpty())) {
            hospitals = hospitalService.searchHospitals(query, location, department);
        } else {
            hospitals = hospitalService.getAllHospitals();
        }

        return ResponseEntity.ok(ApiResponse.ok("Hospitals retrieved successfully", hospitals));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hospital>> getHospitalById(@PathVariable Long id) {
        Hospital hospital = hospitalService.getHospitalById(id);
        return ResponseEntity.ok(ApiResponse.ok("Hospital details retrieved", hospital));
    }
}
