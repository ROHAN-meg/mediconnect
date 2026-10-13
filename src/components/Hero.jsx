import React from 'react';

export default function Hero({ onExploreClick, onRegisterClick, totalHospitals = 8 }) {
  return (
    <section className="hero-banner">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="sparkle">✦</span> MediConnect College Project MVP
        </div>
        <h1 className="hero-heading">
          Connecting Patients with <span className="text-highlight">Quality Healthcare</span> Facilities
        </h1>
        <p className="hero-subtext">
          A centralized healthcare portal built with React and Spring Boot. Easily discover top medical centers,
          filter by specialty & location, register patient profiles, and request appointments securely.
        </p>

        <div className="hero-cta-group">
          <button className="btn btn-primary btn-lg" onClick={onExploreClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Explore Hospitals
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onRegisterClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            Register Patient Profile
          </button>
        </div>

        <div className="hero-stats-strip">
          <div className="stat-card">
            <span className="stat-number">{totalHospitals}+</span>
            <span className="stat-label">Verified Hospitals</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-number">12+</span>
            <span className="stat-label">Specialist Depts</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">MySQL Persisted</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-card">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Access Platform</span>
          </div>
        </div>
      </div>
    </section>
  );
}
