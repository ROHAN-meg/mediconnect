import React, { useState, useEffect } from 'react';
import { loginUser, registerUser, fetchHospitals } from '../services/api';

const ADMIN_DEFAULT_EMAIL = 'srohannkumar1432@gmail.com';
const ADMIN_DEFAULT_PASS = 'rohan@123';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialRole = 'ADMIN' }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [hospitals, setHospitals] = useState([]);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: ADMIN_DEFAULT_EMAIL,
    password: ADMIN_DEFAULT_PASS,
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    hospitalName: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      loadHospitalsList();
      if (selectedRole === 'ADMIN') {
        fillAdminDetails();
        setAuthMode('login');
      }
    }
  }, [isOpen, selectedRole]);

  const loadHospitalsList = async () => {
    try {
      const data = await fetchHospitals();
      setHospitals(data || []);
      if (data && data.length > 0 && !registerForm.hospitalName) {
        setRegisterForm((prev) => ({ ...prev, hospitalName: data[0].name }));
      }
    } catch (e) {
      console.error('Could not load hospitals', e);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    if (role === 'ADMIN') {
      fillAdminDetails();
      setAuthMode('login');
    } else if (role === 'HOSPITAL_MANAGER') {
      setLoginForm({ email: '', password: '' });
      setAuthMode('login');
    } else {
      setLoginForm({ email: '', password: '' });
    }
  };

  const fillAdminDetails = () => {
    setLoginForm({
      email: ADMIN_DEFAULT_EMAIL,
      password: ADMIN_DEFAULT_PASS,
    });
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const user = await loginUser({
        email: loginForm.email.trim(),
        password: loginForm.password.trim(),
      });

      // Role check validation in UI
      if (selectedRole === 'ADMIN' && user.role !== 'ADMIN') {
        throw new Error(`This account has role '${user.role}', not 'ADMIN'.`);
      }
      if (selectedRole === 'HOSPITAL_MANAGER' && user.role !== 'HOSPITAL_MANAGER') {
        throw new Error(`This account has role '${user.role}', not 'HOSPITAL_MANAGER'.`);
      }
      if (selectedRole === 'PATIENT' && user.role !== 'PATIENT') {
        throw new Error(`This account has role '${user.role}', not 'PATIENT'.`);
      }

      setSuccessMsg(`Welcome, ${user.fullName}!`);
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!registerForm.fullName.trim() || !registerForm.email.trim() || !registerForm.phone.trim() || !registerForm.password.trim()) {
      setErrorMsg('Please fill in all required registration fields.');
      return;
    }

    if (selectedRole === 'HOSPITAL_MANAGER' && !registerForm.hospitalName) {
      setErrorMsg('Please select a hospital to manage.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: registerForm.fullName.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim(),
        password: registerForm.password.trim(),
        role: selectedRole,
        hospitalName: selectedRole === 'HOSPITAL_MANAGER' ? registerForm.hospitalName : null,
      };

      const res = await registerUser(payload);

      if (selectedRole === 'HOSPITAL_MANAGER') {
        setSuccessMsg(
          '✓ Registration Submitted! Hospital Manager accounts require Admin approval. Please wait for the Admin to approve your account before logging in.'
        );
        setRegisterForm({ fullName: '', email: '', phone: '', password: '', hospitalName: hospitals[0]?.name || '' });
        setAuthMode('login');
      } else {
        // Patient created directly!
        setSuccessMsg('✓ Patient registered directly! Logging you in...');
        setTimeout(() => {
          onLoginSuccess(res.data);
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">MediConnect Access Portal</h3>
            <p className="modal-subtitle">Select your role to sign in or create an account</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Role Selection Tabs */}
        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab ${selectedRole === 'ADMIN' ? 'active' : ''}`}
            onClick={() => handleRoleChange('ADMIN')}
          >
            <span className="role-tab-badge">Admin</span>
            <span className="role-tab-title">Administrator</span>
          </button>

          <button
            type="button"
            className={`role-tab ${selectedRole === 'HOSPITAL_MANAGER' ? 'active' : ''}`}
            onClick={() => handleRoleChange('HOSPITAL_MANAGER')}
          >
            <span className="role-tab-badge manager">Manager</span>
            <span className="role-tab-title">Hospital Manager</span>
          </button>

          <button
            type="button"
            className={`role-tab ${selectedRole === 'PATIENT' ? 'active' : ''}`}
            onClick={() => handleRoleChange('PATIENT')}
          >
            <span className="role-tab-badge patient">Patient</span>
            <span className="role-tab-title">Patient Portal</span>
          </button>
        </div>

        {/* Auth Mode Toggle (Login vs Register) */}
        {selectedRole !== 'ADMIN' && (
          <div className="auth-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`mode-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              {selectedRole === 'HOSPITAL_MANAGER' ? 'Request Manager Account' : 'Register Direct'}
            </button>
          </div>
        )}

        {/* Role-specific Notice Banner */}
        {selectedRole === 'ADMIN' && (
          <div className="role-notice-card admin-notice">
            <div className="notice-icon">⚡</div>
            <div className="notice-content">
              <strong>Admin Details Auto-Filled</strong>
              <p>System Administrator credentials have been automatically populated for you below.</p>
              <div className="admin-chip-container">
                <span className="admin-chip">Email: <code>{ADMIN_DEFAULT_EMAIL}</code></span>
                <span className="admin-chip">Password: <code>{ADMIN_DEFAULT_PASS}</code></span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fillAdminDetails}
              title="Click to reset and auto-fill Admin credentials"
            >
              Auto-fill Now
            </button>
          </div>
        )}

        {selectedRole === 'HOSPITAL_MANAGER' && authMode === 'register' && (
          <div className="role-notice-card manager-notice">
            <div className="notice-icon">🛡️</div>
            <div className="notice-content">
              <strong>Admin Approval Required</strong>
              <p>
                Hospital Manager accounts <em>cannot be activated directly</em>. After submission, the System Admin
                must review and approve your account before you can log in.
              </p>
            </div>
          </div>
        )}

        {selectedRole === 'PATIENT' && authMode === 'register' && (
          <div className="role-notice-card patient-notice">
            <div className="notice-icon">✓</div>
            <div className="notice-content">
              <strong>Direct Patient Activation</strong>
              <p>Patients are created directly with immediate access to hospital discovery and appointment booking.</p>
            </div>
          </div>
        )}

        {/* Error and Success alerts */}
        {errorMsg && (
          <div className="form-alert form-alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="form-alert form-alert-success" role="alert">
            <span className="alert-icon">✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms */}
        {authMode === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address <span className="req">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password <span className="req">*</span>
              </label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Authenticating...' : `Sign In as ${selectedRole === 'ADMIN' ? 'Admin' : selectedRole === 'HOSPITAL_MANAGER' ? 'Manager' : 'Patient'}`}
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-fullname">
                Full Name <span className="req">*</span>
              </label>
              <input
                id="reg-fullname"
                type="text"
                className="form-input"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                placeholder={selectedRole === 'HOSPITAL_MANAGER' ? 'e.g. Dr. Rajesh Varma' : 'e.g. Priya Sharma'}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">
                  Phone Number <span className="req">*</span>
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  className="form-input"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            {selectedRole === 'HOSPITAL_MANAGER' && (
              <div className="form-group">
                <label className="form-label" htmlFor="reg-hospital">
                  Hospital to Manage <span className="req">*</span>
                </label>
                <select
                  id="reg-hospital"
                  className="form-input"
                  value={registerForm.hospitalName}
                  onChange={(e) => setRegisterForm({ ...registerForm, hospitalName: e.target.value })}
                  required
                >
                  <option value="">-- Select Hospital --</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name} ({h.location})
                    </option>
                  ))}
                </select>
                <span className="form-hint">Admin will verify your affiliation with this hospital.</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">
                Create Password <span className="req">*</span>
              </label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Minimum 4 characters"
                minLength="4"
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : selectedRole === 'HOSPITAL_MANAGER' ? 'Submit for Admin Approval' : 'Create Patient Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
