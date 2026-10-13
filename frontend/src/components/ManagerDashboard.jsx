import React, { useState, useEffect } from 'react';
import { fetchHospitalAppointments, updateAppointmentStatus, fetchHospitals } from '../services/api';

export default function ManagerDashboard({ currentUser }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const hospitalName = currentUser?.hospitalName || 'Apollo Multispeciality Hospital';

  useEffect(() => {
    loadHospitalData();
  }, [currentUser]);

  const loadHospitalData = async () => {
    setLoading(true);
    try {
      const [appts, hospitals] = await Promise.all([
        fetchHospitalAppointments(hospitalName),
        fetchHospitals({ query: hospitalName }),
      ]);
      setAppointments(appts || []);
      if (hospitals && hospitals.length > 0) {
        setHospitalInfo(hospitals[0]);
      }
    } catch (err) {
      console.error('Error loading manager data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    setActionLoadingId(appointmentId);
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setFeedback(`✓ Appointment #${appointmentId} status changed to ${newStatus}`);
      setTimeout(() => setFeedback(''), 4000);
      await loadHospitalData();
    } catch (err) {
      setFeedback(`Failed to update: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="section-container manager-dashboard" id="manager-dashboard">
      {/* Manager Banner */}
      <div className="manager-header-card">
        <div className="manager-header-main">
          <div className="manager-avatar">
            <span>🏥</span>
          </div>
          <div>
            <div className="manager-badge-row">
              <span className="badge badge-manager">Hospital Manager</span>
              <span className="badge badge-approved">Approved & Active</span>
            </div>
            <h2 className="manager-title">{hospitalName}</h2>
            <p className="manager-subtitle">
              Welcome, <strong>{currentUser?.fullName}</strong>. Managing consultations, patient intake, and department scheduling.
            </p>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadHospitalData} disabled={loading}>
          Refresh Queue
        </button>
      </div>

      {feedback && (
        <div className="form-alert form-alert-success">
          <span className="alert-icon">✓</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Hospital Quick Overview */}
      {hospitalInfo && (
        <div className="manager-hospital-details">
          <div className="detail-stat">
            <span className="detail-stat-label">Location</span>
            <span className="detail-stat-val">📍 {hospitalInfo.location}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Available Beds</span>
            <span className="detail-stat-val">🛏️ {hospitalInfo.availableBeds}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Rating</span>
            <span className="detail-stat-val">⭐ {hospitalInfo.rating} / 5.0</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-label">Emergency Desk</span>
            <span className="detail-stat-val">📞 {hospitalInfo.contactNumber}</span>
          </div>
        </div>
      )}

      {/* Appointments List for this Hospital */}
      <div className="manager-content-card">
        <div className="card-top-row">
          <div>
            <h3 className="pane-title">Incoming Consultation & Appointment Queue</h3>
            <p className="pane-subtitle">
              Patient requests specifically directed to {hospitalName}.
            </p>
          </div>
          <span className="queue-counter">
            {appointments.length} Total Requests
          </span>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <span>Fetching patient appointment requests...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-pending-card">
            <div className="empty-icon">📅</div>
            <h4>No Appointment Requests Yet</h4>
            <p>New consultation requests for your hospital will appear here immediately.</p>
          </div>
        ) : (
          <div className="manager-appts-grid">
            {appointments.map((a) => (
              <div key={a.id} className="manager-appt-card">
                <div className="appt-card-top">
                  <div>
                    <span className="appt-id">Request #{a.id}</span>
                    <h4 className="patient-name">{a.patientName}</h4>
                  </div>
                  <span
                    className={`badge ${
                      a.status === 'CONFIRMED'
                        ? 'badge-approved'
                        : a.status === 'COMPLETED'
                        ? 'badge-admin'
                        : a.status === 'CANCELLED'
                        ? 'badge-rejected'
                        : 'badge-pending'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <div className="appt-card-body">
                  <div className="appt-field">
                    <span className="field-label">Department:</span>
                    <span className="field-value">🩺 {a.department}</span>
                  </div>
                  <div className="appt-field">
                    <span className="field-label">Preferred Date:</span>
                    <span className="field-value">📅 {a.preferredDate}</span>
                  </div>
                  <div className="appt-field">
                    <span className="field-label">Contact:</span>
                    <span className="field-value">{a.patientPhone} | {a.patientEmail}</span>
                  </div>
                  {a.reason && (
                    <div className="appt-field reason">
                      <span className="field-label">Reason / Notes:</span>
                      <p className="reason-text">"{a.reason}"</p>
                    </div>
                  )}
                </div>

                <div className="appt-actions">
                  {a.status === 'REQUESTED' && (
                    <>
                      <button
                        className="btn btn-approve btn-sm"
                        onClick={() => handleStatusChange(a.id, 'CONFIRMED')}
                        disabled={actionLoadingId === a.id}
                      >
                        ✓ Confirm
                      </button>
                      <button
                        className="btn btn-reject btn-sm"
                        onClick={() => handleStatusChange(a.id, 'CANCELLED')}
                        disabled={actionLoadingId === a.id}
                      >
                        ✕ Decline
                      </button>
                    </>
                  )}
                  {a.status === 'CONFIRMED' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleStatusChange(a.id, 'COMPLETED')}
                      disabled={actionLoadingId === a.id}
                    >
                      ✓ Mark Completed
                    </button>
                  )}
                  {a.status === 'COMPLETED' && (
                    <span className="status-finished">Session Completed</span>
                  )}
                  {a.status === 'CANCELLED' && (
                    <span className="status-cancelled">Request Declined</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
