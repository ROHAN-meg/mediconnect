package com.mediconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class AppointmentStatusUpdateDto {

    @NotBlank(message = "Status is required")
    private String status;

    public AppointmentStatusUpdateDto() {
    }

    public AppointmentStatusUpdateDto(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
