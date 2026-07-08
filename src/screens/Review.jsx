import { useLocation, useNavigate } from 'react-router-dom';

export default function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addedServicesList = [], totalAmount = 2065.00 } = location.state || {};

  const steps = [
    { number: '✓', label: 'Appointment Details', active: false, completed: true },
    { number: '✓', label: 'Your Details', active: false, completed: true },
    { number: '✓', label: 'Book Appointment', active: false, completed: true },
    { number: '✓', label: 'Services', active: false, completed: true },
    { number: 5, label: 'Review', active: true },
  ];

  // Mock data for previous steps since it wasn't passed globally
  const appointmentDetails = {
    center: 'VFS Global, New Delhi',
    category: 'Short Term Visa',
    subCategory: 'Tourist'
  };

  const applicant = {
    firstName: 'TUSHAR',
    lastName: 'DESAI',
    passport: 'A1234567',
    gender: 'Male',
    nationality: 'India'
  };

  const booking = {
    date: '15 July 2026',
    time: '10:30 AM'
  };

  return (
    <div className="appointment-page">
      {/* Stepper Header */}
      <div className="stepper-header-wrapper">
        <div className="stepper-container">
          {steps.map((step, idx) => (
            <div key={idx} className={`step ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
              <div className={`step-number ${step.completed ? 'bg-green' : ''}`}>{step.number}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
        <div className="total-amount">
          <span className="total-label">Total amount</span>
          <span className="total-value">INR {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="appointment-card">
        <div className="card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <h2>Review Your Application</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Please review all the details before making the final payment.</p>
        </div>

        <div className="review-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' }}>Appointment Details</h3>
          <div className="review-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Visa Application Centre</span>
              <strong style={{ color: '#334155' }}>{appointmentDetails.center}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Appointment Category</span>
              <strong style={{ color: '#334155' }}>{appointmentDetails.category}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Sub-Category</span>
              <strong style={{ color: '#334155' }}>{appointmentDetails.subCategory}</strong>
            </div>
          </div>
        </div>

        <div className="review-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' }}>Applicant Details</h3>
          <div className="review-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Full Name</span>
              <strong style={{ color: '#334155' }}>{applicant.firstName} {applicant.lastName}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Passport Number</span>
              <strong style={{ color: '#334155' }}>{applicant.passport}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Gender / Nationality</span>
              <strong style={{ color: '#334155' }}>{applicant.gender} / {applicant.nationality}</strong>
            </div>
          </div>
        </div>

        <div className="review-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' }}>Booking Date & Time</h3>
          <div className="review-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Date</span>
              <strong style={{ color: '#334155' }}>{booking.date}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Time</span>
              <strong style={{ color: '#334155' }}>{booking.time}</strong>
            </div>
          </div>
        </div>

        <div className="review-section" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' }}>Services & Fees</h3>
          <div className="services-list-container added-services-block" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div className="services-header-row" style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <div>Description</div>
              <div>Amount</div>
            </div>
            <div className="services-body" style={{ padding: '0 1rem' }}>
              <div className="service-item-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ color: '#334155' }}>Basic Service Fee</div>
                <div style={{ fontWeight: '500' }}>INR 2,065.00</div>
              </div>
              {addedServicesList.map((service) => (
                <div key={service.id} className="service-item-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ color: '#334155' }}>{service.title}</div>
                  <div style={{ fontWeight: '500' }}>INR {service.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              ))}
              <div className="service-item-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>
                <div>Total Amount Payable</div>
                <div>INR {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer form-actions" style={{ marginTop: '2rem' }}>
          <button type="button" className="btn-cancel" onClick={() => navigate('/services')}>Go Back</button>
          <button
            type="button"
            className="btn-save"
            onClick={() => navigate('/payment', { state: { totalAmount } })}
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
}
