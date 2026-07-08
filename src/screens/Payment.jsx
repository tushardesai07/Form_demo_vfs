import { useLocation, useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalAmount = 2065.00 } = location.state || {};

  const handlePayment = (e) => {
    e.preventDefault();
    
    const newAppointment = {
      id: `VFS-${Math.floor(Math.random() * 9000) + 1000}`,
      name: 'TUSHAR DESAI',
      type: 'Short Term Visa',
      status: 'Paid',
      date: '15 Jul, 2026',
      time: '10:30 AM'
    };

    alert("Payment Successful! Your appointment is booked.");
    navigate('/dashboard', { state: { newAppointment } });
  };

  return (
    <div className="appointment-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
      <div className="appointment-card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <div className="card-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h2>Secure Payment</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Complete your booking by securely paying the fee.</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '1rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount Payable</span>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>
            INR {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <form onSubmit={handlePayment} className="form-content">
          <div className="form-group-app" style={{ marginBottom: '1.5rem' }}>
            <label>Cardholder Name<span className="asterisk">*</span></label>
            <input type="text" className="custom-input" placeholder="Name on card" required />
          </div>

          <div className="form-group-app" style={{ marginBottom: '1.5rem' }}>
            <label>Card Number<span className="asterisk">*</span></label>
            <div style={{ position: 'relative' }}>
              <input type="text" className="custom-input" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" required />
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '30px', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
                <div style={{ width: '30px', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="form-group-app">
              <label>Expiry Date<span className="asterisk">*</span></label>
              <input type="text" className="custom-input" placeholder="MM/YY" maxLength="5" required />
            </div>
            <div className="form-group-app">
              <label>CVV<span className="asterisk">*</span></label>
              <input type="password" className="custom-input" placeholder="123" maxLength="4" required />
            </div>
          </div>

          <button
            type="submit"
            className="btn-save"
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Pay Now
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '500' }}>
            ← Cancel and return
          </button>
        </div>
      </div>
    </div>
  );
}
