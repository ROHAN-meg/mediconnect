import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HospitalDirectory from './components/HospitalDirectory';
import PatientRegister from './components/PatientRegister';
import PatientDashboard from './components/PatientDashboard';
import AppointmentModal from './components/AppointmentModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mediconnect_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('mediconnect_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'ADMIN') return 'admin';
        if (u.role === 'HOSPITAL_MANAGER') return 'manager';
      }
    } catch {}
    return 'hospitals';
  });

  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    initialRole: 'ADMIN',
  });

  const [appointmentModalState, setAppointmentModalState] = useState({
    isOpen: false,
    hospital: null,
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mediconnect_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mediconnect_user');
    }
  }, [currentUser]);

  const handleOpenAuthModal = (role = 'ADMIN') => {
    setAuthModalState({
      isOpen: true,
      initialRole: role,
    });
  };

  const handleCloseAuthModal = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setActiveTab('admin');
    } else if (user.role === 'HOSPITAL_MANAGER') {
      setActiveTab('manager');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('hospitals');
  };

  const handleOpenAppointmentModal = (hospital) => {
    setAppointmentModalState({
      isOpen: true,
      hospital: hospital,
    });
  };

  const handleCloseAppointmentModal = () => {
    setAppointmentModalState({
      isOpen: false,
      hospital: null,
    });
  };

  const handlePatientRegistrationSuccess = (patient) => {
    setCurrentUser({
      ...patient,
      role: 'PATIENT',
      status: 'APPROVED',
    });
    setActiveTab('dashboard');
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Quick Role Switcher Banner for demonstration */}
      <div className="demo-role-banner">
        <div className="banner-inner">
          <span className="banner-tag">Demo Access</span>
          <span className="banner-text">
            {currentUser ? (
              <>
                Active Session: <strong>{currentUser.fullName}</strong> (<code>{currentUser.role}</code>)
              </>
            ) : (
              'Quick test roles: Admin is seeded with autofill, Manager requires approval, Patient activates directly.'
            )}
          </span>
          <div className="banner-actions">
            {!currentUser ? (
              <>
                <button
                  className="banner-btn admin"
                  onClick={() => handleOpenAuthModal('ADMIN')}
                >
                  ⚡ Admin Login (Auto-filled)
                </button>
                <button
                  className="banner-btn manager"
                  onClick={() => handleOpenAuthModal('HOSPITAL_MANAGER')}
                >
                  🏥 Hospital Manager
                </button>
                <button
                  className="banner-btn patient"
                  onClick={() => handleOpenAuthModal('PATIENT')}
                >
                  👤 Patient
                </button>
              </>
            ) : (
              <button className="banner-btn switch" onClick={handleLogout}>
                Switch / Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="main-content">
        {/* Hospital Directory Tab (Always available) */}
        {activeTab === 'hospitals' && (
          <>
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('hospital-directory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onRegisterClick={() => {
                if (!currentUser) handleOpenAuthModal('PATIENT');
                else setActiveTab('register');
              }}
            />
            <HospitalDirectory
              onRequestAppointment={handleOpenAppointmentModal}
            />
          </>
        )}

        {/* Admin Dashboard */}
        {activeTab === 'admin' && currentUser?.role === 'ADMIN' && (
          <AdminDashboard
            currentUser={currentUser}
            onNavigateHospitals={() => setActiveTab('hospitals')}
          />
        )}

        {/* Manager Dashboard */}
        {activeTab === 'manager' && currentUser?.role === 'HOSPITAL_MANAGER' && (
          <ManagerDashboard
            currentUser={currentUser}
          />
        )}

        {/* Patient Register */}
        {activeTab === 'register' && (
          <PatientRegister
            onRegistrationSuccess={handlePatientRegistrationSuccess}
            onNavigateDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* Patient Dashboard */}
        {activeTab === 'dashboard' && (
          <PatientDashboard
            currentPatient={currentUser?.role === 'PATIENT' ? currentUser : null}
            setCurrentPatient={setCurrentUser}
            onNavigateHospitals={() => setActiveTab('hospitals')}
            onNavigateRegister={() => setActiveTab('register')}
            onRequestAppointment={handleOpenAppointmentModal}
          />
        )}
      </main>

      {/* Auth Modal for Admin, Hospital Manager, Patient */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialRole={authModalState.initialRole}
        onClose={handleCloseAuthModal}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={appointmentModalState.isOpen}
        hospital={appointmentModalState.hospital}
        currentPatient={currentUser?.role === 'PATIENT' ? currentUser : null}
        onClose={handleCloseAppointmentModal}
        onRequestCreated={() => {}}
      />

      <Footer />
    </div>
  );
}

export default App;
