package com.mediconnect.controller;

import com.mediconnect.dto.ApiResponse;
import com.mediconnect.dto.LoginRequestDto;
import com.mediconnect.dto.RegisterRequestDto;
import com.mediconnect.dto.UserResponseDto;
import com.mediconnect.entity.UserStatus;
import com.mediconnect.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@Valid @RequestBody RegisterRequestDto dto) {
        UserResponseDto response = authService.register(dto);
        String message;
        if (response.getStatus() == UserStatus.PENDING) {
            message = "Hospital Manager registration submitted successfully! Your account requires Admin approval before you can log in.";
        } else {
            message = "Patient registered successfully! You can now log in and book appointments.";
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(message, response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponseDto>> login(@Valid @RequestBody LoginRequestDto dto) {
        UserResponseDto response = authService.login(dto);
        return ResponseEntity.ok(ApiResponse.ok("Login successful! Welcome back, " + response.getFullName() + ".", response));
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserByEmail(@PathVariable String email) {
        UserResponseDto response = authService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("User details retrieved", response));
    }
}
