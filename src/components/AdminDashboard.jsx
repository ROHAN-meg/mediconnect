import React, { useState, useEffect } from 'react';
import {
  fetchPendingManagers,
  approveManager,
  rejectManager,
  fetchAllUsers,
  fetchAdminStats,
  fetchHospitals,
} from '../services/api';

export default function AdminDashboard({ currentUser, onNavigateHospitals }) {
  const [stats, setStats] = useState(null);
  const [pendingManagers, setPendingManagers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals', 'users'
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, pendingData, usersData] = await Promise.all([
        fetchAdminStats(),
        fetchPendingManagers(),
        fetchAllUsers(),
      ]);
      setStats(statsData);
      setPendingManagers(pendingData || []);
      setAllUsers(usersData || []);
    } catch (err) {
      console.error('Error loading admin dashboard data', err);
      showFeedback('Error loading dashboard data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (text, type = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg({ text: '', type: '' });
    }, 4500);
  };

  const handleApprove = async (managerId, managerName) => {
    setActionLoadingId(managerId);
    try {
      await approveManager(managerId);
      showFeedback(`✓ Successfully approved Hospital Manager "${managerName}"!`, 'success');
      await loadDashboardData();
    } catch (err) {
      showFeedback(`Failed to approve: ${err.message}`, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (managerId, managerName) => {
    if (!window.confirm(`Are you sure you want to reject registration for "${managerName}"?`)) {
      return;
    }
    setActionLoadingId(managerId);
    try {
      await rejectManager(managerId);
      showFeedback(`Hospital Manager "${managerName}" registration rejected.`, 'info');
      await loadDashboardData();
    } catch (err) {
      showFeedback(`Failed to reject: ${err.message}`, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = allUsers.filter((u) => {
    if (userRoleFilter === 'ALL') return true;
    return u.role === userRoleFilter;
  });

  return (
    <div className="section-container admin-dashboard" id="admin-dashboard">
      {/* Admin Header Banner */}
      <div className="admin-header-card">
        <div className="admin-header-main">
          <div className="admin-avatar">
            <span>🛡️</span>
          </div>
          <div>
            <div className="admin-badge-row">
              <span className="badge badge-admin">Master Administrator</span>
              <span className="badge badge-status-active">Superuser Session</span>
            </div>
            <h2 className="admin-title">System Control Center</h2>
            <p className="admin-subtitle">
              Logged in as <strong>{currentUser?.fullName}</strong> ({currentUser?.email}).
              Manage hospital manager approvals, review system access, and oversee healthcare operations.
            </p>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadDashboardData} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg.text && (
        <div className={`form-alert ${feedbackMsg.type === 'error' ? 'form-alert-error' : 'form-alert-success'}`}>
          <span className="alert-icon">{feedbackMsg.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card pending-card">
          <div className="stat-icon-wrapper amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending Manager Approvals</span>
            <div className="stat-val-row">
              <span className="stat-value highlight-amber">{stats?.pendingManagers ?? 0}</span>
              {stats?.pendingManagers > 0 && <span className="stat-chip-pulse">Needs Review</span>}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper teal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Approved Managers</span>
            <span className="stat-value">{stats?.approvedManagers ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Registered Patients</span>
            <span className="stat-value">{stats?.totalPatients ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6" />
              <path d="M12 6v6" />
              <path d="M9 15h6" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Hospitals Connected</span>
            <span className="stat-value">{stats?.totalHospitals ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="admin-tabs-nav">
        <button
          className={`admin-nav-btn ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          <span className="btn-icon">🛡️</span>
          Manager Approvals
          {pendingManagers.length > 0 && (
            <span className="count-pill">{pendingManagers.length}</span>
          )}
        </button>

        <button
          className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="btn-icon">👥</span>
          All System Users ({allUsers.length})
        </button>
      </div>

      {/* Tab 1: Hospital Manager Approvals */}
      {activeTab === 'approvals' && (
        <div className="admin-tab-content">
          <div className="tab-pane-header">
            <div>
              <h3 className="pane-title">Pending Hospital Manager Registration Requests</h3>
              <p className="pane-subtitle">
                Hospital Managers cannot log in until approved. Review the hospital affiliation and approve or reject access.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-loading">
              <div className="loading-spinner"></div>
              <span>Fetching pending manager registrations...</span>
            </div>
          ) : pendingManagers.length === 0 ? (
            <div className="empty-pending-card">
              <div className="empty-icon">✓</div>
              <h4>All Manager Approvals Are Up To Date</h4>
              <p>There are currently no hospital managers awaiting verification.</p>
            </div>
          ) : (
            <div className="approvals-grid">
              {pendingManagers.map((m) => (
                <div key={m.id} className="approval-card">
                  <div className="approval-card-top">
                    <div className="approval-avatar">
                      {m.fullName.charAt(0)}
                    </div>
                    <div className="approval-info">
                      <div className="approval-name-row">
                        <h4 className="approval-name">{m.fullName}</h4>
                        <span className="badge badge-pending">PENDING APPROVAL</span>
                      </div>
                      <span className="approval-hospital">🏥 {m.hospitalName || 'Unassigned Hospital'}</span>
                    </div>
                  </div>

                  <div className="approval-details-list">
                    <div className="approval-detail-item">
                      <span className="detail-key">Email:</span>
                      <span className="detail-val">{m.email}</span>
                    </div>
                    <div className="approval-detail-item">
                      <span className="detail-key">Phone:</span>
                      <span className="detail-val">{m.phone}</span>
                    </div>
                    <div className="approval-detail-item">
                      <span className="detail-key">Requested On:</span>
                      <span className="detail-val">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="approval-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleApprove(m.id, m.fullName)}
                      disabled={actionLoadingId === m.id}
                    >
                      {actionLoadingId === m.id ? 'Processing...' : '✓ Approve Manager'}
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => handleReject(m.id, m.fullName)}
                      disabled={actionLoadingId === m.id}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: All Users Directory */}
      {activeTab === 'users' && (
        <div className="admin-tab-content">
          <div className="tab-pane-header">
            <div>
              <h3 className="pane-title">All Registered MediConnect Users</h3>
              <p className="pane-subtitle">Complete registry of Administrators, Hospital Managers, and Patients.</p>
            </div>
            <div className="filter-pill-group">
              {['ALL', 'ADMIN', 'HOSPITAL_MANAGER', 'PATIENT'].map((role) => (
                <button
                  key={role}
                  className={`filter-pill ${userRoleFilter === role ? 'active' : ''}`}
                  onClick={() => setUserRoleFilter(role)}
                >
                  {role === 'ALL' ? 'All Roles' : role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Affiliation</th>
                  <th>Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <span className="avatar-chip">{u.fullName.charAt(0)}</span>
                        <div>
                          <strong>{u.fullName}</strong>
                          <span className="sub-text">ID #{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{u.email}</div>
                      <span className="sub-text">{u.phone}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'ADMIN'
                            ? 'badge-admin'
                            : u.role === 'HOSPITAL_MANAGER'
                            ? 'badge-manager'
                            : 'badge-patient'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{u.hospitalName || '—'}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.status === 'APPROVED'
                            ? 'badge-approved'
                            : u.status === 'PENDING'
                            ? 'badge-pending'
                            : 'badge-rejected'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
