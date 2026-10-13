import React, { useState, useEffect } from 'react';
import { createAppointmentRequest } from '../services/api';

export default function AppointmentModal({
  isOpen,
  onClose,
  hospital,
  currentPatient,
  onRequestCreated,
}) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    hospitalName: '',
    department: '',
    preferredDate: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (hospital) {
      const depts = hospital.department ? hospital.department.split(',').map((d) => d.trim()) : [];
      setFormData({
        patientName: currentPatient?.fullName || '',
        patientEmail: currentPatient?.email || '',
        patientPhone: currentPatient?.phone || '',
        hospitalName: hospital.name || '',
        department: depts[0] || 'General Medicine',
        preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        reason: '',
      });
      setError('');
      setSuccess(false);
    }
  }, [hospital, currentPatient]);

  if (!isOpen || !hospital) return null;

  const depts = hospital.department ? hospital.department.split(',').map((d) => d.trim()) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.patientName.trim() || !formData.patientEmail.trim() || !formData.patientPhone.trim()) {
      setError('Please provide patient name, email, and phone number.');
      return;
    }

    setLoading(true);
    try {
      const response = await createAppointmentRequest(formData);
      if (response && response.success) {
        setSuccess(true);
        if (onRequestCreated) {
          onRequestCreated(response.data);
        }
      } else {
        throw new Error(response.message || 'Appointment request failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit appointment request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="badge badge-primary">Feature E</span>
            <h3>Request Medical Consultation</h3>
            <p className="modal-subtitle">
              Target Facility: <strong>{hospital.name}</strong> ({hospital.location})
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close modal">
            ✕
          </button>
        </div>

        {success ? (
          <div className="modal-body success-modal-body">
            <div className="success-icon-wrapper">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4>Consultation Request Recorded in MySQL!</h4>
            <p>
              Your request for <strong>{formData.department}</strong> at <strong>{hospital.name}</strong> on{' '}
              <strong>{formData.preferredDate}</strong> has been logged with status <code>REQUESTED</code>.
            </p>
            <div className="alert alert-info">
              <small>
                <strong>Academic Project Note:</strong> This is an initial consultation request. In an institutional setup,
                hospital staff would review department schedules before confirming.
              </small>
            </div>
            <button className="btn btn-primary btn-block" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            {!currentPatient && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Demo Helper:</span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      patientName: 'Demo College Patient',
                      patientEmail: 'student_demo@mediconnect.edu',
                      patientPhone: '+91 9876543210',
                      reason: 'Routine health screening and physician consultation',
                    }));
                  }}
                >
                  ⚡ Autofill Demo Details
                </button>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Patient Name *</label>
              <input
                type="text"
                name="patientName"
                className="form-input"
                placeholder="Patient Full Name"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="patientEmail"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="patientPhone"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid-2-col">
              <div className="form-group">
                <label className="form-label">Department / Specialty *</label>
                <select
                  name="department"
                  className="form-input"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {depts.map((d, idx) => (
                    <option key={idx} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  className="form-input"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Symptoms (Optional)</label>
              <textarea
                name="reason"
                className="form-textarea"
                rows="3"
                placeholder="Briefly state symptoms or clinical concerns..."
                value={formData.reason}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting to Backend...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
