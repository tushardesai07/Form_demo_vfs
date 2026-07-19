import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('overview'); // 'overview' | 'users' | 'applicants'
  const [selectedAppt, setSelectedAppt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAppointments();
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://visahub.atlantechglobal.com/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmMessage = currentRole === 'admin' 
      ? 'Are you sure you want to demote this user from Admin to Standard User?' 
      : 'Are you sure you want to promote this user to Administrator?';
      
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`https://visahub.atlantechglobal.com/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error connecting to the server');
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('https://visahub.atlantechglobal.com/api/appointments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  // Calculate Metrics
  const totalBookings = appointments.length;
  const totalRevenue = appointments.reduce((sum, appt) => sum + Number(appt.total_amount || 0), 0);
  const paidBookings = appointments.filter(a => a.status === 'Paid').length;

  return (
    <div className="premium-dashboard">
      {/* Sidebar */}
      <aside className="premium-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>VFS</div>
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className={`nav-item ${currentView === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentView('overview'); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Overview
          </a>
          <a href="#" className={`nav-item ${currentView === 'users' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentView('users'); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Users
          </a>
          <a href="#" className={`nav-item ${currentView === 'applicants' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentView('applicants'); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><circle cx="12" cy="14" r="3"></circle></svg>
            All Applicants
          </a>
        </nav>
      </aside>

      <main className="premium-main">
        {/* Header */}
        <header className="premium-header">
          <div className="header-greeting">
            <h1>Welcome back, Admin</h1>
            <p>Here is an overview of all system bookings and operations.</p>
          </div>
          <div className="header-actions">
            <button className="btn-premium-action" onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </button>
            <div className="user-profile">
              <div className="avatar" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>AD</div>
            </div>
          </div>
        </header>

        {/* Metrics - Only show on Overview */}
        {currentView === 'overview' && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon blue-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div className="metric-details">
                <h3>Total Bookings</h3>
                <div className="metric-value">
                  <span className="number">{totalBookings}</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon green-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div className="metric-details">
                <h3>Total Revenue</h3>
                <div className="metric-value">
                  <span className="number" style={{ fontSize: '1.5rem' }}>INR {totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon orange-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="metric-details">
                <h3>Total Applicants</h3>
                <div className="metric-value">
                  <span className="number">{appointments.flatMap(a => a.applicants || []).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Data Table */}
        <div className="table-container-card">
          <div className="table-header-row">
            <h2>{currentView === 'overview' ? 'All Appointments' : currentView === 'users' ? 'Registered Users' : 'All Applicants'}</h2>
            <div className="table-controls">
              <div className="search-bar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder={`Search ${currentView}...`} />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            {currentView === 'overview' ? (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Applicant Details</th>
                    <th>Category / Centre</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading appointments...</td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No appointments booked yet.</td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="font-medium text-dark">VFS-{appt.id}</td>
                        <td>
                          {appt.applicants && appt.applicants.length > 0 ? (
                            appt.applicants.map((app, idx) => (
                              <div key={idx} style={{ marginBottom: idx < appt.applicants.length - 1 ? '0.5rem' : '0' }}>
                                <div className="font-medium text-dark">{app.first_name} {app.last_name}</div>
                                <div className="time-subtext">Passport: {app.passport_number}</div>
                              </div>
                            ))
                          ) : (
                            <span className="time-subtext">No applicant details</span>
                          )}
                        </td>
                        <td>
                          <div className="font-medium text-dark">{appt.category}</div>
                          <div className="time-subtext">{appt.centre}</div>
                        </td>
                        <td>
                          <div className="date-cell">
                            <span>{appt.booking_date}</span>
                            <span className="time-subtext">{appt.booking_time}</span>
                          </div>
                        </td>
                        <td className="font-medium text-dark">
                          INR {Number(appt.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <span className={`pill-badge ${appt.status === 'Paid' ? 'approved' : 'pending'}`}>
                            <span className="pulse-dot"></span>
                            {appt.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-icon-action" title="View Details" onClick={() => setSelectedAppt(appt)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : currentView === 'users' ? (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No users found.</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="font-medium text-dark">#{user.id}</td>
                        <td>
                          <div className="cell-flex">
                            <div className="mini-avatar" style={{ background: user.role === 'admin' ? '#ef4444' : '#3b82f6' }}>{user.name.charAt(0).toUpperCase()}</div>
                            <span className="font-medium text-dark">{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`pill-badge ${user.role === 'admin' ? 'pending' : 'approved'}`}>
                            {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => toggleUserRole(user.id, user.role)}
                            className="btn-icon-action" 
                            title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                            style={{ 
                              width: 'auto', 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 'bold', 
                              border: `1px solid ${user.role === 'admin' ? '#ef4444' : '#10b981'}`, 
                              color: user.role === 'admin' ? '#ef4444' : '#10b981', 
                              background: 'transparent',
                              cursor: 'pointer'
                            }}
                          >
                            Make {user.role === 'admin' ? 'User' : 'Admin'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Booking Ref</th>
                    <th>Applicant Name</th>
                    <th>Passport No</th>
                    <th>Nationality</th>
                    <th>Gender / DOB</th>
                    <th>Address</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.flatMap(appt => 
                    (appt.applicants || []).map(app => ({ ...app, bookingId: appt.id }))
                  ).length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No applicants found.</td>
                    </tr>
                  ) : (
                    appointments.flatMap(appt => 
                      (appt.applicants || []).map(app => ({ ...app, bookingId: appt.id }))
                    ).map((applicant, idx) => (
                      <tr key={idx}>
                        <td className="font-medium text-dark">VFS-{applicant.bookingId}</td>
                        <td>
                          <div className="font-medium text-dark">{applicant.first_name} {applicant.last_name}</div>
                        </td>
                        <td>{applicant.passport_number}</td>
                        <td>{applicant.nationality?.toUpperCase() || 'N/A'}</td>
                        <td>
                          <div className="date-cell">
                            <span>{applicant.gender}</span>
                            <span className="time-subtext">{new Date(applicant.dob).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{applicant.address_line_1} {applicant.address_line_2}</div>
                          <div className="time-subtext">{applicant.city}, {applicant.state} {applicant.postcode}</div>
                        </td>
                        <td>
                          <div>{applicant.email}</div>
                          <div className="time-subtext">+{applicant.phone_code} {applicant.phone_number}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Appointment Details Modal */}
      {selectedAppt && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Application Details (VFS-{selectedAppt.id})</h2>
              <button onClick={() => setSelectedAppt(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            
            <div className="print-area">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <h4 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Visa Application Centre</h4>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{selectedAppt.centre || 'VFS Global'}</div>
                </div>
                <div>
                  <h4 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Category & Sub-Category</h4>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{selectedAppt.category} - {selectedAppt.sub_category || 'General'}</div>
                </div>
                <div>
                  <h4 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date & Time</h4>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{selectedAppt.booking_date} at {selectedAppt.booking_time}</div>
                </div>
                <div>
                  <h4 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Status & Amount</h4>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    <span style={{ color: selectedAppt.status === 'Paid' ? '#10b981' : '#f59e0b', marginRight: '0.5rem' }}>{selectedAppt.status}</span>
                    (INR {Number(selectedAppt.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Applicants</h3>
              {selectedAppt.applicants && selectedAppt.applicants.length > 0 ? (
                selectedAppt.applicants.map((applicant, idx) => (
                  <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Name</div>
                        <div style={{ fontWeight: '500' }}>{applicant.first_name} {applicant.last_name}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Passport</div>
                        <div style={{ fontWeight: '500' }}>{applicant.passport_number}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Gender / DOB</div>
                        <div style={{ fontWeight: '500' }}>{applicant.gender} / {new Date(applicant.dob).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Contact</div>
                        <div style={{ fontWeight: '500' }}>{applicant.email}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#64748b' }}>No detailed applicant information available.</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => setSelectedAppt(null)} 
                style={{ padding: '0.75rem 1.5rem', border: '1px solid #cbd5e1', backgroundColor: 'white', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close
              </button>
              <button 
                onClick={() => window.print()} 
                style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#10b981', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
