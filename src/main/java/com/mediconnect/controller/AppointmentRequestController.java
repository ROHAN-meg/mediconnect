package com.mediconnect.controller;

import com.mediconnect.dto.ApiResponse;
import com.mediconnect.dto.AppointmentRequestDto;
import com.mediconnect.dto.AppointmentStatusUpdateDto;
import com.mediconnect.entity.AppointmentRequest;
import com.mediconnect.service.AppointmentRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(originPatterns = "*")
public class AppointmentRequestController {

    private final AppointmentRequestService appointmentRequestService;

    public AppointmentRequestController(AppointmentRequestService appointmentRequestService) {
        this.appointmentRequestService = appointmentRequestService;
    }

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<AppointmentRequest>> createAppointmentRequest(
            @Valid @RequestBody AppointmentRequestDto dto) {
        AppointmentRequest created = appointmentRequestService.createAppointmentRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Appointment request submitted successfully. The hospital will contact you for confirmation.", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentRequest>>> getAllAppointments() {
        List<AppointmentRequest> list = appointmentRequestService.getAllAppointments();
        return ResponseEntity.ok(ApiResponse.ok("Appointments retrieved successfully", list));
    }

    @GetMapping("/patient/{email}")
    public ResponseEntity<ApiResponse<List<AppointmentRequest>>> getAppointmentsByPatientEmail(
            @PathVariable String email) {
        List<AppointmentRequest> list = appointmentRequestService.getAppointmentsByPatientEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("Patient appointment requests retrieved", list));
    }

    @GetMapping("/hospital/{hospitalName}")
    public ResponseEntity<ApiResponse<List<AppointmentRequest>>> getAppointmentsByHospital(
            @PathVariable String hospitalName) {
        List<AppointmentRequest> list = appointmentRequestService.getAppointmentsByHospital(hospitalName);
        return ResponseEntity.ok(ApiResponse.ok("Hospital appointment requests retrieved", list));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentRequest>> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusUpdateDto dto) {
        AppointmentRequest updated = appointmentRequestService.updateAppointmentStatus(id, dto.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Appointment status updated to " + updated.getStatus(), updated));
    }
}
