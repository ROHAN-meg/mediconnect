package com.mediconnect.dto;

public class AdminStatsDto {

    private long totalUsers;
    private long totalPatients;
    private long pendingManagers;
    private long approvedManagers;
    private long totalHospitals;
    private long totalAppointments;

    public AdminStatsDto() {
    }

    public AdminStatsDto(long totalUsers, long totalPatients, long pendingManagers, long approvedManagers, long totalHospitals, long totalAppointments) {
        this.totalUsers = totalUsers;
        this.totalPatients = totalPatients;
        this.pendingManagers = pendingManagers;
        this.approvedManagers = approvedManagers;
        this.totalHospitals = totalHospitals;
        this.totalAppointments = totalAppointments;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getPendingManagers() {
        return pendingManagers;
    }

    public void setPendingManagers(long pendingManagers) {
        this.pendingManagers = pendingManagers;
    }

    public long getApprovedManagers() {
        return approvedManagers;
    }

    public void setApprovedManagers(long approvedManagers) {
        this.approvedManagers = approvedManagers;
    }

    public long getTotalHospitals() {
        return totalHospitals;
    }

    public void setTotalHospitals(long totalHospitals) {
        this.totalHospitals = totalHospitals;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }
}
