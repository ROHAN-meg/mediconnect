package com.mediconnect.repository;

import com.mediconnect.entity.AppointmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRequestRepository extends JpaRepository<AppointmentRequest, Long> {
    List<AppointmentRequest> findByPatientEmailOrderByCreatedAtDesc(String patientEmail);
    List<AppointmentRequest> findByHospitalNameIgnoreCaseOrderByCreatedAtDesc(String hospitalName);
    List<AppointmentRequest> findByHospitalNameContainingIgnoreCaseOrderByCreatedAtDesc(String hospitalName);
    List<AppointmentRequest> findAllByOrderByCreatedAtDesc();
}
