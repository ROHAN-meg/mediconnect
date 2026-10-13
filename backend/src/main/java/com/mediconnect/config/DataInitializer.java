package com.mediconnect.config;

import com.mediconnect.entity.Hospital;
import com.mediconnect.entity.Patient;
import com.mediconnect.entity.User;
import com.mediconnect.entity.UserRole;
import com.mediconnect.entity.UserStatus;
import com.mediconnect.repository.HospitalRepository;
import com.mediconnect.repository.PatientRepository;
import com.mediconnect.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    public DataInitializer(HospitalRepository hospitalRepository,
                           UserRepository userRepository,
                           PatientRepository patientRepository) {
        this.hospitalRepository = hospitalRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public void run(String... args) {
        initializeHospitals();
        initializeUsers();
    }

    private void initializeHospitals() {
        if (hospitalRepository.count() == 0) {
            List<Hospital> demoHospitals = Arrays.asList(
                new Hospital(
                    "Apollo Multispeciality Hospital",
                    "Bengaluru",
                    "Cardiology, Neurology, Oncology, Orthopedics",
                    "+91 80 2630 4050",
                    "154/11, Bannerghatta Main Rd, Bengaluru, Karnataka",
                    "Comprehensive multispecialty tertiary care hospital with advanced critical care units and trauma center.",
                    4.8,
                    45
                ),
                new Hospital(
                    "Fortis Memorial Health Institute",
                    "Gurugram",
                    "Cardiology, Orthopedics, Pediatrics, Nephrology",
                    "+91 124 492 1020",
                    "Sector 44, Opposite HUDA City Centre, Gurugram, Haryana",
                    "State-of-the-art super speciality quaternary healthcare institute offering specialized robotic surgery and heart center.",
                    4.7,
                    38
                ),
                new Hospital(
                    "Manipal Hospital Whitefield",
                    "Bengaluru",
                    "Pediatrics, Obstetrics & Gynecology, General Surgery, Dermatology",
                    "+91 80 2502 4444",
                    "ITPL Main Rd, KIADB Export Promotion Industrial Area, Bengaluru, Karnataka",
                    "Trusted healthcare destination providing patient-centric emergency care, maternity services, and pediatric wing.",
                    4.6,
                    28
                ),
                new Hospital(
                    "Max Super Speciality Hospital",
                    "New Delhi",
                    "Oncology, Cardiology, Pulmonology, Gastroenterology",
                    "+91 11 2651 5050",
                    "1, 2, Press Enclave Marg, Saket, New Delhi, Delhi",
                    "Premier tertiary care hospital renowned for advanced cancer therapies and cardiovascular interventions.",
                    4.9,
                    52
                ),
                new Hospital(
                    "Kokilaben Dhirubhai Ambani Hospital",
                    "Mumbai",
                    "Neurology, Organ Transplant, Sports Medicine, Cardiology",
                    "+91 22 4269 6969",
                    "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, Maharashtra",
                    "Full-time specialist system hospital recognized for multi-organ transplants and comprehensive rehabilitation.",
                    4.8,
                    40
                ),
                new Hospital(
                    "KIMS Hospitals (Krishna Institute of Medical Sciences)",
                    "Hyderabad",
                    "Nephrology, Urology, Cardiology, Emergency Care",
                    "+91 40 4488 5000",
                    "1-8-31/1, Minister Rd, Krishna Nagar Colony, Begumpet, Secunderabad, Telangana",
                    "One of the largest healthcare groups in South India providing affordable super speciality medical treatments.",
                    4.5,
                    32
                ),
                new Hospital(
                    "MIOT International Hospital",
                    "Chennai",
                    "Orthopedics, Joint Replacement, Trauma Care, Cardiology",
                    "+91 44 4200 2288",
                    "4/112, Mount Poonamallee Rd, Manapakkam, Chennai, Tamil Nadu",
                    "Pioneer in joint replacements and trauma treatments with international standard operating theatres.",
                    4.7,
                    25
                ),
                new Hospital(
                    "Ruby Hall Clinic",
                    "Pune",
                    "General Medicine, Cardiology, Neurology, Endocrinology",
                    "+91 20 6645 5100",
                    "40, Sassoon Rd, Sangamvadi, Pune, Maharashtra",
                    "Leading healthcare institution in western India known for quality cardiac surgery and endocrinology clinic.",
                    4.6,
                    30
                )
            );

            hospitalRepository.saveAll(demoHospitals);
            System.out.println("Initialized " + demoHospitals.size() + " demonstration hospital records in MySQL mediconnect_college_db.");
        }
    }

    private void initializeUsers() {
        String adminEmail = "srohannkumar1432@gmail.com";

        // 1. Seed or Update the Admin user
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(
                "Rohan Kumar (Admin)",
                adminEmail,
                "+91 9876543210",
                "rohan@123",
                UserRole.ADMIN,
                UserStatus.APPROVED
            );
            userRepository.save(admin);
            System.out.println("Seeded Admin user: " + adminEmail + " with password rohan@123");
        }

        // 2. Seed a sample PENDING Hospital Manager so the admin can test approval right away
        String pendingManagerEmail = "vikram.manager@apollo.com";
        if (!userRepository.existsByEmail(pendingManagerEmail)) {
            User manager = new User(
                "Dr. Vikram Sharma",
                pendingManagerEmail,
                "+91 9845112233",
                "manager@123",
                UserRole.HOSPITAL_MANAGER,
                UserStatus.PENDING,
                "Apollo Multispeciality Hospital"
            );
            userRepository.save(manager);
            System.out.println("Seeded demo PENDING Hospital Manager: " + pendingManagerEmail);
        }

        // 3. Seed an APPROVED Hospital Manager for instant testing
        String approvedManagerEmail = "ananya.manager@fortis.com";
        if (!userRepository.existsByEmail(approvedManagerEmail)) {
            User manager = new User(
                "Dr. Ananya Roy",
                approvedManagerEmail,
                "+91 9876500112",
                "manager@123",
                UserRole.HOSPITAL_MANAGER,
                UserStatus.APPROVED,
                "Fortis Memorial Health Institute"
            );
            userRepository.save(manager);
            System.out.println("Seeded demo APPROVED Hospital Manager: " + approvedManagerEmail);
        }

        // 4. Seed a sample patient
        String patientEmail = "rahul.verma@example.com";
        if (!userRepository.existsByEmail(patientEmail)) {
            User patientUser = new User(
                "Rahul Verma",
                patientEmail,
                "+91 9123456789",
                "patient@123",
                UserRole.PATIENT,
                UserStatus.APPROVED
            );
            userRepository.save(patientUser);

            if (!patientRepository.existsByEmail(patientEmail)) {
                Patient patient = new Patient(
                    "Rahul Verma",
                    patientEmail,
                    "+91 9123456789",
                    "patient@123"
                );
                patientRepository.save(patient);
            }
            System.out.println("Seeded demo Patient: " + patientEmail);
        }
    }
}
