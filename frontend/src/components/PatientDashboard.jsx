import React, { useState, useEffect } from 'react';
import { fetchPatientByEmail, fetchPatientAppointments } from '../services/api';

export default function PatientDashboard({
  currentPatient,
  setCurrentPatient,
  onNavigateHospitals,
  onNavigateRegister,
  onRequestAppointment,
}) {
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);

  useEffect(() => {
    if (currentPatient && currentPatient.email) {
      loadAppointments(currentPatient.email);
    }
  }, [currentPatient]);

  const loadAppointments = async (email) => {
    setLoadingAppts(true);
    try {
      const data = await fetchPatientAppointments(email);
      setAppointments(data);
    } catch {
      setAppointments([]);
    } finally {
      setLoadingAppts(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupEmail.trim()) return;

    setLookupLoading(true);
    setLookupError('');
    try {
      const patient = await fetchPatientByEmail(lookupEmail.trim());
      if (patient) {
        setCurrentPatient(patient);
        setLookupEmail('');
      } else {
        setLookupError('Patient profile not found for this email address.');
      }
    } catch (err) {
      setLookupError(err.message || 'No registered patient found with that email.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="section-container" id="patient-dashboard">
      <div className="section-header">
        <span className="section-tag">Feature D</span>
        <h2 className="section-title">Patient Demonstration Dashboard</h2>
        <p className="section-subtitle">
          Manage your personal medical profile, review consultation requests, and explore hospital networks.
        </p>
      </div>

      {currentPatient ? (
        <div className="dashboard-layout">
          {/* Welcome Card */}
          <div className="welcome-banner">
            <div className="welcome-avatar">
              <span>{currentPatient.fullName?.charAt(0) || 'P'}</span>
            </div>
            <div className="welcome-content">
              <span className="welcome-tag">Active Demonstration Session</span>
              <h3 className="welcome-title">Welcome back, {currentPatient.fullName}!</h3>
              <p className="welcome-desc">
                Your MediConnect patient account is active and connected to the MySQL backend.
                You can browse affiliated hospitals or submit consultation requests.
              </p>
            </div>
            <div className="welcome-actions">
              <button className="btn btn-secondary btn-sm" onClick={onNavigateHospitals}>
                Discover Hospitals
              </button>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Profile Information Card */}
            <div className="dash-card profile-card">
              <div className="dash-card-header">
                <div className="card-title-group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <h4>Patient Profile Details</h4>
                </div>
                <span className="badge badge-success">Verified Record</span>
              </div>

              <div className="profile-details-list">
                <div className="detail-item">
                  <span className="detail-label">Patient Record ID</span>
                  <span className="detail-value">#MED-{currentPatient.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{currentPatient.fullName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registered Email</span>
                  <span className="detail-value">{currentPatient.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone Contact</span>
                  <span className="detail-value">{currentPatient.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">
                    {currentPatient.createdAt
                      ? new Date(currentPatient.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Today'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Persisted Storage</span>
                  <span className="detail-value text-muted">MySQL `mediconnect_college_db`</span>
                </div>
              </div>

              <div className="dash-card-footer">
                <button
                  className="btn btn-outline btn-block btn-sm"
                  onClick={() => setCurrentPatient(null)}
                >
                  Switch / Log out of Demo Patient
                </button>
              </div>
            </div>

            {/* Quick Actions & Stats Card */}
            <div className="dash-card quick-actions-card">
              <div className="dash-card-header">
                <div className="card-title-group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <h4>Healthcare Actions</h4>
                </div>
              </div>

              <div className="quick-actions-list">
                <div className="action-tile" onClick={onNavigateHospitals}>
                  <div className="action-icon icon-blue">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M9 9h6" />
                      <path d="M12 6v6" />
                    </svg>
                  </div>
                  <div className="action-info">
                    <h5>Search & Filter Hospitals</h5>
                    <p>Find nearby specialty clinics and emergency facilities</p>
                  </div>
                  <span className="action-arrow">→</span>
                </div>

                <div
                  className="action-tile"
                  onClick={() => onRequestAppointment({ name: 'General Consultation', department: 'General Medicine' })}
                >
                  <div className="action-icon icon-green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <polyline points="16 11 18 13 22 9" />
                    </svg>
                  </div>
                  <div className="action-info">
                    <h5>Request New Consultation</h5>
                    <p>Submit an appointment inquiry to any affiliated hospital</p>
                  </div>
                  <span className="action-arrow">→</span>
                </div>
              </div>

              {/* Consultation Requests History */}
              <div className="recent-requests-section">
                <div className="sub-header">
                  <h5>Your Consultation Requests</h5>
                  <span className="counter-pill">{appointments.length}</span>
                </div>

                {loadingAppts ? (
                  <p className="loading-small">Loading requests from MySQL...</p>
                ) : appointments.length === 0 ? (
                  <div className="empty-sub">
                    <p>No appointment requests submitted yet.</p>
                    <button className="btn btn-link btn-sm" onClick={onNavigateHospitals}>
                      Browse hospitals to request an appointment
                    </button>
                  </div>
                ) : (
                  <div className="appts-mini-list">
                    {appointments.map((appt) => (
                      <div key={appt.id} className="appt-mini-item">
                        <div className="appt-main">
                          <strong>{appt.hospitalName}</strong>
                          <span className="appt-sub">{appt.department} • Date: {appt.preferredDate}</span>
                        </div>
                        <span className="badge badge-warning">{appt.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / No Patient Selected state */
        <div className="no-patient-card">
          <div className="no-patient-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="17" y1="8" x2="23" y2="8" />
            </svg>
          </div>
          <h3 className="no-patient-title">No Active Patient Profile</h3>
          <p className="no-patient-desc">
            To view personalized dashboard data and request appointments, please register a new patient profile or load an existing registered record.
          </p>

          <div className="lookup-box">
            <form onSubmit={handleLookup} className="lookup-form">
              <input
                type="email"
                className="form-input lookup-input"
                placeholder="Enter registered email (e.g. rohan@test.com)"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                disabled={lookupLoading}
              />
              <button type="submit" className="btn btn-secondary" disabled={lookupLoading}>
                {lookupLoading ? 'Checking...' : 'Load Profile'}
              </button>
            </form>
            {lookupError && <span className="field-error-msg lookup-error">{lookupError}</span>}
          </div>

          <div className="divider-text">OR</div>

          <button className="btn btn-primary btn-lg" onClick={onNavigateRegister}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Register a New Patient Profile
          </button>
        </div>
      )}
    </div>
  );
}
