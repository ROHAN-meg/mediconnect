import React, { useState } from 'react';
import { registerPatient } from '../services/api';

export default function PatientRegister({ onRegistrationSuccess, onNavigateDashboard }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [registeredData, setRegisteredData] = useState(null);

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9+\s\-()]{7,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (7-15 digits)';
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters if provided';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await registerPatient(formData);
      if (response && response.success && response.data) {
        setRegisteredData(response.data);
        if (onRegistrationSuccess) {
          onRegistrationSuccess(response.data);
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      setServerError(err.message || 'Unable to connect to the backend server. Please ensure Spring Boot is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    setRegisteredData(null);
    setFormData({ fullName: '', email: '', phone: '', password: '' });
    setFieldErrors({});
    setServerError('');
  };

  return (
    <div className="section-container" id="patient-registration">
      <div className="section-header">
        <span className="section-tag">Feature A</span>
        <h2 className="section-title">Patient Registration</h2>
        <p className="section-subtitle">
          Register with MediConnect to schedule consultations, receive medical alerts, and access personalized healthcare services.
        </p>
      </div>

      <div className="form-wrapper">
        {registeredData ? (
          <div className="success-card">
            <div className="success-icon-wrapper">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="success-title">Registration Confirmed in MySQL!</h3>
            <p className="success-desc">
              Patient record for <strong>{registeredData.fullName}</strong> was successfully verified and saved to the database.
            </p>

            <div className="patient-receipt">
              <div className="receipt-row">
                <span className="receipt-label">Patient ID:</span>
                <span className="receipt-value">#MED-{registeredData.id}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Full Name:</span>
                <span className="receipt-value">{registeredData.fullName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Email:</span>
                <span className="receipt-value">{registeredData.email}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Phone:</span>
                <span className="receipt-value">{registeredData.phone}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Database Status:</span>
                <span className="badge badge-success">Persisted (mediconnect_college_db)</span>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn btn-primary" onClick={onNavigateDashboard}>
                Open Patient Dashboard
              </button>
              <button className="btn btn-outline" onClick={handleRegisterAnother}>
                Register Another Patient
              </button>
            </div>
          </div>
        ) : (
          <form className="patient-form" onSubmit={handleSubmit} noValidate>
            <div className="demo-fill-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>College Presentation Demo Helper:</span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  const demoEmail = `student_${Math.floor(1000 + Math.random() * 9000)}@college.edu`;
                  setFormData({
                    fullName: 'Demo College Patient',
                    email: demoEmail,
                    phone: '+91 9876543210',
                    password: 'password123',
                  });
                  setFieldErrors({});
                  setServerError('');
                }}
              >
                ⚡ Fill Demo Patient Details
              </button>
            </div>

            {serverError && (
              <div className="alert alert-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="alert-content">
                  <strong>Registration Error:</strong>
                  <span>{serverError}</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={`form-input ${fieldErrors.fullName ? 'input-error' : ''}`}
                  placeholder="e.g. S Rohan Kumar"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {fieldErrors.fullName && <span className="field-error-msg">{fieldErrors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                  placeholder="e.g. rohan@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && <span className="field-error-msg">{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`form-input ${fieldErrors.phone ? 'input-error' : ''}`}
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {fieldErrors.phone && <span className="field-error-msg">{fieldErrors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password <span className="optional-tag">(Optional for demonstration)</span>
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                  placeholder="Enter a secure password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {fieldErrors.password && <span className="field-error-msg">{fieldErrors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting to Spring Boot Backend...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                  Complete Registration
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
