package com.mediconnect.service;

import com.mediconnect.dto.AppointmentRequestDto;
import com.mediconnect.entity.AppointmentRequest;
import com.mediconnect.exception.ResourceNotFoundException;
import com.mediconnect.repository.AppointmentRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentRequestService {

    private final AppointmentRequestRepository appointmentRequestRepository;

    public AppointmentRequestService(AppointmentRequestRepository appointmentRequestRepository) {
        this.appointmentRequestRepository = appointmentRequestRepository;
    }

    @Transactional
    public AppointmentRequest createAppointmentRequest(AppointmentRequestDto dto) {
        AppointmentRequest req = new AppointmentRequest();
        req.setPatientName(dto.getPatientName().trim());
        req.setPatientEmail(dto.getPatientEmail().trim().toLowerCase());
        req.setPatientPhone(dto.getPatientPhone().trim());
        req.setHospitalName(dto.getHospitalName().trim());
        req.setDepartment(dto.getDepartment().trim());
        req.setPreferredDate(dto.getPreferredDate().trim());
        req.setReason(dto.getReason() != null ? dto.getReason().trim() : "");
        req.setStatus("REQUESTED");

        return appointmentRequestRepository.save(req);
    }

    @Transactional(readOnly = true)
    public List<AppointmentRequest> getAppointmentsByPatientEmail(String email) {
        return appointmentRequestRepository.findByPatientEmailOrderByCreatedAtDesc(email.trim().toLowerCase());
    }

    @Transactional(readOnly = true)
    public List<AppointmentRequest> getAppointmentsByHospital(String hospitalName) {
        return appointmentRequestRepository.findByHospitalNameContainingIgnoreCaseOrderByCreatedAtDesc(hospitalName.trim());
    }

    @Transactional(readOnly = true)
    public List<AppointmentRequest> getAllAppointments() {
        return appointmentRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public AppointmentRequest updateAppointmentStatus(Long id, String status) {
        AppointmentRequest request = appointmentRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment request not found with ID: " + id));

        request.setStatus(status.toUpperCase().trim());
        return appointmentRequestRepository.save(request);
    }
}
