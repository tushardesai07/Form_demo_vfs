import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (location.state && location.state.newAppointment) {
      setResponses(prev => {
        const exists = prev.find(r => r.id === location.state.newAppointment.id);
        if (exists) return prev;
        return [location.state.newAppointment, ...prev];
      });
      // Clear location state to prevent duplicates on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleAddResponse = () => {
    navigate('/appointment');
  };

  const totalApplications = responses.length;
  const approvedVisas = responses.filter(r => r.status === 'Approved').length;
  const pendingReview = responses.filter(r => ['Pending', 'Reviewing'].includes(r.status)).length;

  return (
    <div className="premium-dashboard">
      {/* Sidebar Mock */}
      <aside className="premium-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">VFS</div>
          <h2>Global Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </a>
        </nav>
      </aside>

      <main className="premium-main">
        {/* Top Header */}
        <header className="premium-header">
          <div className="header-greeting">
            <h1>Welcome back, Tushar</h1>
            <p>Here is what's happening with your applications today.</p>
          </div>
          <div className="header-actions">
            <button className="btn-premium-action" onClick={handleAddResponse}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Application
            </button>
            <div className="user-profile">
              <div className="avatar">TD</div>
            </div>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon blue-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div className="metric-details">
              <h3>Total Applications</h3>
              <div className="metric-value">
                <span className="number">{totalApplications}</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon green-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="metric-details">
              <h3>Approved Visas</h3>
              <div className="metric-value">
                <span className="number">{approvedVisas}</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon orange-bg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className="metric-details">
              <h3>Pending Review</h3>
              <div className="metric-value">
                <span className="number">{pendingReview}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container-card">
          <div className="table-header-row">
            <h2>Recent Applications</h2>
            <div className="table-controls">
              <div className="search-bar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search applications..." />
              </div>
              <button className="btn-filter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filter
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant Name</th>
                  <th>Visa Type</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response.id}>
                    <td className="font-medium">{response.id}</td>
                    <td>
                      <div className="cell-flex">
                        <div className="mini-avatar">{response.name.charAt(0)}</div>
                        <span className="font-medium text-dark">{response.name}</span>
                      </div>
                    </td>
                    <td>{response.type}</td>
                    <td>
                      <div className="date-cell">
                        <span>{response.date}</span>
                        <span className="time-subtext">{response.time}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`pill-badge ${response.status.toLowerCase()}`}>
                        <span className="pulse-dot"></span>
                        {response.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon-action">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
