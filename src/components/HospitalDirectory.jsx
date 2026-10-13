import React, { useState, useEffect } from 'react';
import { fetchHospitals } from '../services/api';

const COMMON_DEPARTMENTS = [
  'All Departments',
  'Cardiology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Nephrology',
  'General Medicine',
  'Dermatology',
];

const COMMON_LOCATIONS = [
  'All Locations',
  'Bengaluru',
  'New Delhi',
  'Mumbai',
  'Hyderabad',
  'Chennai',
  'Gurugram',
  'Pune',
];

export default function HospitalDirectory({ onRequestAppointment }) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const loadHospitals = async () => {
    setLoading(true);
    setError('');
    try {
      const loc = selectedLocation === 'All Locations' ? '' : selectedLocation;
      const dept = selectedDept === 'All Departments' ? '' : selectedDept;
      const data = await fetchHospitals({ query: searchQuery, location: loc, department: dept });
      setHospitals(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the backend server. Please verify Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, [selectedLocation, selectedDept]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadHospitals();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All Locations');
    setSelectedDept('All Departments');
  };

  return (
    <div className="section-container" id="hospital-directory">
      <div className="section-header">
        <span className="section-tag">Features B & C</span>
        <h2 className="section-title">Hospital Directory & Search</h2>
        <p className="section-subtitle">
          Find accredited healthcare facilities, explore available specialties, and view emergency contacts backed by live MySQL data.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-panel">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by hospital name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary search-btn">
            Search
          </button>
        </form>

        <div className="dropdown-filters">
          <div className="filter-select-group">
            <label htmlFor="locationSelect" className="filter-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Location
            </label>
            <select
              id="locationSelect"
              className="filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {COMMON_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <label htmlFor="deptSelect" className="filter-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Specialty / Department
            </label>
            <select
              id="deptSelect"
              className="filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {COMMON_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedLocation !== 'All Locations' || selectedDept !== 'All Departments') && (
            <button className="btn btn-ghost reset-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Hospital List Area */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p className="loading-text">Loading hospitals from Spring Boot MySQL backend...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="alert-content">
            <strong>Backend Communication Error:</strong>
            <span>{error}</span>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '8px' }} onClick={loadHospitals}>
              Retry Connection
            </button>
          </div>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="empty-results-card">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <h3 className="empty-title">No Hospitals Found</h3>
          <p className="empty-desc">
            No medical centers match your search criteria "{searchQuery || selectedLocation || selectedDept}".
            Try broadening your search or resetting the active filters.
          </p>
          <button className="btn btn-primary" onClick={handleResetFilters}>
            Show All Hospitals
          </button>
        </div>
      ) : (
        <>
          <div className="results-summary">
            <span>
              Showing <strong>{hospitals.length}</strong> accredited hospital{hospitals.length !== 1 ? 's' : ''}
            </span>
            <span className="source-tag">Source: MySQL mediconnect_college_db</span>
          </div>

          <div className="hospitals-grid">
            {hospitals.map((hospital) => {
              const depts = hospital.department ? hospital.department.split(',').map((d) => d.trim()) : [];
              return (
                <div key={hospital.id} className="hospital-card">
                  <div className="hospital-card-header">
                    <div className="hospital-title-row">
                      <h3 className="hospital-name">{hospital.name}</h3>
                      {hospital.rating && (
                        <div className="hospital-rating">
                          <span className="star">★</span>
                          <span>{hospital.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="hospital-location-row">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="location-text">{hospital.location}</span>
                    </div>
                  </div>

                  <p className="hospital-desc">{hospital.description || hospital.address}</p>

                  <div className="departments-section">
                    <span className="depts-label">Specialties & Departments:</span>
                    <div className="department-tags">
                      {depts.map((d, index) => (
                        <span key={index} className="dept-tag">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hospital-meta-row">
                    <div className="contact-info">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <a href={`tel:${hospital.contactNumber}`} className="contact-phone">
                        {hospital.contactNumber}
                      </a>
                    </div>
                    {hospital.availableBeds && (
                      <span className="beds-badge">
                        {hospital.availableBeds} Beds Avail.
                      </span>
                    )}
                  </div>

                  <div className="hospital-card-footer">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => onRequestAppointment(hospital)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Request Consultation
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
