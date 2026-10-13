package com.mediconnect.controller;

import com.mediconnect.dto.AdminStatsDto;
import com.mediconnect.dto.ApiResponse;
import com.mediconnect.dto.UserResponseDto;
import com.mediconnect.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(originPatterns = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/managers/pending")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getPendingManagers() {
        List<UserResponseDto> pending = adminService.getPendingManagers();
        return ResponseEntity.ok(ApiResponse.ok("Pending hospital manager approvals retrieved", pending));
    }

    @PutMapping("/managers/{id}/approve")
    public ResponseEntity<ApiResponse<UserResponseDto>> approveManager(@PathVariable Long id) {
        UserResponseDto approved = adminService.approveManager(id);
        return ResponseEntity.ok(ApiResponse.ok("Hospital Manager '" + approved.getFullName() + "' approved successfully!", approved));
    }

    @PutMapping("/managers/{id}/reject")
    public ResponseEntity<ApiResponse<UserResponseDto>> rejectManager(@PathVariable Long id) {
        UserResponseDto rejected = adminService.rejectManager(id);
        return ResponseEntity.ok(ApiResponse.ok("Hospital Manager '" + rejected.getFullName() + "' rejected.", rejected));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllUsers() {
        List<UserResponseDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("All registered users retrieved", users));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        AdminStatsDto stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin system statistics retrieved", stats));
    }
}
