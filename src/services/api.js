const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Hospitals
export async function fetchHospitals({ query = '', location = '', department = '' } = {}) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (location) params.append('location', location);
  if (department) params.append('department', department);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/api/hospitals${queryString}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch hospitals');
  }
  return result.data || [];
}

// Auth: Login
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Login failed');
  }
  return result.data;
}

// Auth: Register (Patient directly, Hospital Manager pending)
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Registration failed');
  }
  return result;
}

// Legacy Patient registration wrapper for backwards compatibility
export async function registerPatient(patientData) {
  return registerUser({
    ...patientData,
    role: 'PATIENT',
  });
}

export async function fetchPatientByEmail(email) {
  const response = await fetch(`${API_BASE_URL}/api/patients/email/${encodeURIComponent(email)}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Patient not found');
  }
  return result.data;
}

// Appointments
export async function createAppointmentRequest(appointmentData) {
  const response = await fetch(`${API_BASE_URL}/api/appointments/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Appointment request failed');
  }
  return result;
}

export async function fetchPatientAppointments(email) {
  const response = await fetch(`${API_BASE_URL}/api/appointments/patient/${encodeURIComponent(email)}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch appointments');
  }
  return result.data || [];
}

export async function fetchHospitalAppointments(hospitalName) {
  const response = await fetch(`${API_BASE_URL}/api/appointments/hospital/${encodeURIComponent(hospitalName)}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch hospital appointments');
  }
  return result.data || [];
}

export async function updateAppointmentStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/api/appointments/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update appointment status');
  }
  return result.data;
}

// Admin APIs
export async function fetchPendingManagers() {
  const response = await fetch(`${API_BASE_URL}/api/admin/managers/pending`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch pending managers');
  }
  return result.data || [];
}

export async function approveManager(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/managers/${id}/approve`, {
    method: 'PUT',
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to approve manager');
  }
  return result.data;
}

export async function rejectManager(id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/managers/${id}/reject`, {
    method: 'PUT',
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to reject manager');
  }
  return result.data;
}

export async function fetchAllUsers() {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch users');
  }
  return result.data || [];
}

export async function fetchAdminStats() {
  const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch admin stats');
  }
  return result.data;
}
