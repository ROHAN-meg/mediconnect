package com.mediconnect.controller;

import com.mediconnect.dto.ApiResponse;
import com.mediconnect.dto.PatientRegistrationDto;
import com.mediconnect.entity.Patient;
import com.mediconnect.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(originPatterns = "*")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Patient>> registerPatient(@Valid @RequestBody PatientRegistrationDto dto) {
        Patient registeredPatient = patientService.registerPatient(dto);
        // Do not expose password hash in response
        registeredPatient.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Patient registered successfully! Welcome to MediConnect.", registeredPatient));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getPatientById(@PathVariable Long id) {
        Patient patient = patientService.getPatientById(id);
        patient.setPassword(null);
        return ResponseEntity.ok(ApiResponse.ok("Patient found", patient));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<Patient>> getPatientByEmail(@PathVariable String email) {
        Patient patient = patientService.getPatientByEmail(email);
        patient.setPassword(null);
        return ResponseEntity.ok(ApiResponse.ok("Patient profile retrieved", patient));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        patients.forEach(p -> p.setPassword(null));
        return ResponseEntity.ok(ApiResponse.ok("Patients list retrieved", patients));
    }
}
