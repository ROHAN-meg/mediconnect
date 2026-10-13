import React, { useState, useEffect } from 'react';
import { fetchPendingManagers } from '../services/api';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      fetchPendingManagers()
        .then((list) => setPendingCount(list ? list.length : 0))
        .catch(() => {});
    }
  }, [currentUser, activeTab]);

  return (
    <header className="navbar-header">
      <div className="nav-container">
        {/* Brand */}
        <div className="brand" onClick={() => setActiveTab('hospitals')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 5v6" />
              <path d="M9 8h6" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">MediConnect</span>
            <span className="brand-subtitle">Smart Healthcare Platform</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button
            className={`nav-link ${activeTab === 'hospitals' ? 'active' : ''}`}
            onClick={() => setActiveTab('hospitals')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6" />
              <path d="M12 6v6" />
              <path d="M9 15h6" />
            </svg>
            Hospital Directory
          </button>

          {/* Admin Tab */}
          {currentUser?.role === 'ADMIN' && (
            <button
              className={`nav-link nav-link-admin ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Admin Control Center
              {pendingCount > 0 && <span className="nav-badge admin-count-badge">{pendingCount}</span>}
            </button>
          )}

          {/* Hospital Manager Tab */}
          {currentUser?.role === 'HOSPITAL_MANAGER' && (
            <button
              className={`nav-link nav-link-manager ${activeTab === 'manager' ? 'active' : ''}`}
              onClick={() => setActiveTab('manager')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Manager Portal
            </button>
          )}

          {/* Patient Tabs */}
          {(!currentUser || currentUser?.role === 'PATIENT') && (
            <>
              <button
                className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Patient Register
              </button>

              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
                Patient Dashboard
              </button>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {currentUser ? (
            <div className="user-profile-group">
              <div
                className="user-profile-btn"
                onClick={() => {
                  if (currentUser.role === 'ADMIN') setActiveTab('admin');
                  else if (currentUser.role === 'HOSPITAL_MANAGER') setActiveTab('manager');
                  else setActiveTab('dashboard');
                }}
              >
                <span className={`avatar-initial ${currentUser.role.toLowerCase()}`}>
                  {currentUser.role === 'ADMIN' ? '⚡' : currentUser.fullName?.charAt(0) || 'U'}
                </span>
                <div className="user-name-role">
                  <span className="profile-name">{currentUser.fullName}</span>
                  <span className={`role-chip role-${currentUser.role.toLowerCase()}`}>
                    {currentUser.role === 'HOSPITAL_MANAGER' ? 'Manager' : currentUser.role}
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm logout-btn" onClick={onLogout} title="Sign Out">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <button
                className="btn btn-primary btn-sm login-trigger-btn"
                onClick={() => onOpenAuthModal('ADMIN')}
              >
                <span className="key-icon">⚡</span> Sign In / Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
