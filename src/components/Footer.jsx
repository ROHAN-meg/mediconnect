import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-icon-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M12 5v6" />
                <path d="M9 8h6" />
              </svg>
            </div>
            <div>
              <div className="footer-brand-title">MediConnect</div>
              <div className="footer-brand-desc">Smart Healthcare Access Platform</div>
            </div>
          </div>

          <div className="tech-stack-badges">
            <span className="tech-badge">React 19 + Vite</span>
            <span className="tech-badge">Java Spring Boot</span>
            <span className="tech-badge">Spring Data JPA</span>
            <span className="tech-badge">MySQL Database</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} MediConnect. College Project Presentation MVP by S Rohan Kumar.
          </p>
          <p className="academic-notice">
            Database: <code>mediconnect_college_db</code> (Port 3306) • Backend: <code>http://localhost:8080</code> • Frontend: <code>http://localhost:5173</code>
          </p>
        </div>
      </div>
    </footer>
  );
}
