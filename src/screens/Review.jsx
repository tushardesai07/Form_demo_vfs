import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptComm, setAcceptComm] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/payment', { 
        state: { appointmentDetails, applicants, booking, addedServicesList, totalAmount } 
      });
    }, 2000);
  };

  const { 
    appointmentDetails = {}, 
    applicants = [], 
    booking = {}, 
    addedServicesList = [], 
    totalAmount = 2065.00 
  } = location.state || {};

  const primaryApplicant = applicants.length > 0 ? applicants[0] : {
    firstName: 'TUSHAR', lastName: 'DESAI', passportNumber: 'A1234567', gender: 'Male', nationality: 'India'
  };

  const servicesSubTotal = addedServicesList.reduce((acc, curr) => acc + curr.price, 0);

  const steps = [
    { number: '✓', label: 'Appointment Details', active: false, completed: true },
    { number: '✓', label: 'Your Details', active: false, completed: true },
    { number: '✓', label: 'Book Appointment', active: false, completed: true },
    { number: '✓', label: 'Services', active: false, completed: true },
    { number: 5, label: 'Review', active: true },
  ];

  return (
    <div className="appointment-page">
      {isProcessing && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '5px solid #e2e8f0', borderTop: '5px solid #d97706', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <h2 style={{ marginTop: '20px', color: '#334155', fontWeight: '500' }}>Redirecting to Payment Gateway...</h2>
          <p style={{ marginTop: '10px', color: '#64748b' }}>Please do not refresh or press back button.</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Header Info */}
      <div className="top-header-info" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
        <div></div>
        <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
          <div style={{ color: '#d97706', fontWeight: 'bold' }}>My Account ▾</div>
          <div style={{ fontWeight: 'bold' }}>GEB72331016894</div>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="stepper-header-wrapper" style={{ marginTop: '1rem' }}>
        <div className="stepper-container">
          {steps.map((step, idx) => (
            <div key={idx} className={`step ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
              <div className={`step-number ${step.completed ? 'bg-green' : ''}`} style={{ backgroundColor: step.completed ? '#10b981' : (step.active ? '#0369a1' : '#cbd5e1') }}>{step.number}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
        <div className="total-amount" style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span className="total-label" style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>Total amount</span>
          <span className="total-value" style={{ display: 'block', color: '#10b981', fontWeight: 'bold' }}>INR {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {showDisclaimer ? (
        <div className="appointment-card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.5rem' }}>Payment Disclaimer</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Read these instructions carefully before making a payment.</p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '0.5rem' }}>Payment Confirmation</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginBottom: '0.5rem' }}>Communication to VFS from payment gateways, whether the payment was successful or not, can take up to 2 hours.</p>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginBottom: '0.5rem' }}>If the payment has not been deducted, wait 2 hours then create a new appointment before making another payment.</p>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>If your payment has been deducted from your bank account but VFS has failed to confirm your appointment, kindly reach out to VFS support for requesting refund.</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '0.5rem' }}>Successful Payment</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6' }}>You will receive an email notification with a PDF attachment acknowledging the payment made for your application. Please keep this email safely with you.</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '0.5rem' }}>Useful tips</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginBottom: '1rem' }}>Do ensure there are sufficient funds in your account.</p>
            <ol style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Payment Cancelled: If your payment is cancelled after reaching the payment gateway, you will come back to the Review and Pay page where you can try to make another payment.</li>
              <li style={{ marginBottom: '0.5rem' }}>Payment Declined: Payment can be declined for multiple reasons: incorrect card credentials, incorrect OTP to authenticate and validate your payment, insufficient funds in your bank account, and reaching the maximum spend limit on your credit or debit card.</li>
              <li>Do not - close the browser before returning to the VFS confirmation page, click the back button on the browser while making a payment.</li>
            </ol>
          </div>

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '3rem' }}>
            <button 
              type="button" 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #d97706', color: '#d97706', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }} 
              onClick={() => setShowDisclaimer(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#d97706', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="appointment-card" style={{ maxWidth: '800px', margin: '2rem auto', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.5rem' }}>Review</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Please check all your details carefully, ensuring you can attend your chosen appointment time, and you have added any services you need.</p>

        {/* Section 1: Applicant Details */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Applicant details</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Country of residence</div>
              <div style={{ fontSize: '0.95rem' }}>INDIA</div>
            </div>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Travelling to</div>
              <div style={{ fontSize: '0.95rem' }}>GERMANY</div>
            </div>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Application Centre</div>
              <div style={{ fontSize: '0.95rem' }}>{appointmentDetails.centre || 'Mumbai - Germany Visa Application Centre'}</div>
            </div>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Appointment Category</div>
              <div style={{ fontSize: '0.95rem' }}>{appointmentDetails.category || 'Airport transit visa (A and C)'}</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Appointment Sub Category</div>
              <div style={{ fontSize: '0.95rem' }}>{appointmentDetails.subCategory || 'Airport transit visa (A and C)'}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Your Details */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Your details</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Applicant 1</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{primaryApplicant.firstName.toUpperCase()} {primaryApplicant.lastName.toUpperCase()}</div>
            </div>
            <div style={{ color: '#64748b', cursor: 'pointer' }}>⌄</div>
          </div>
        </div>

        {/* Section 3: Appointment details */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Appointment details</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Appointment type</div>
              <div style={{ fontSize: '0.95rem' }}>Standard</div>
            </div>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Date</div>
              <div style={{ fontSize: '0.95rem' }}>{booking.date || '27-09-2026'}</div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Time</div>
              <div style={{ fontSize: '0.95rem' }}>{booking.time || '08:45'}</div>
            </div>
          </div>
        </div>

        {/* Section 4: Services */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Services</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Sub-Total</div>
            <div style={{ fontSize: '0.95rem', color: '#10b981' }}>INR {servicesSubTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        {/* Section 5: Fees */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Fees</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>VFS Service Fee</div>
              <div style={{ fontSize: '0.95rem' }}>INR 2,065.00</div>
            </div>
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Sub-Total</div>
              <div style={{ fontSize: '0.95rem', color: '#10b981' }}>INR 2,065.00</div>
            </div>
          </div>
        </div>

        {/* Section 6: Additional Fees */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155' }}>Additional Fees</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Sub-Total</div>
              <div style={{ fontSize: '0.95rem', color: '#10b981' }}>INR 0.00</div>
            </div>
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Total</div>
              <div style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: 'bold' }}>INR {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} style={{ marginRight: '10px' }} />
            <span style={{ fontSize: '0.9rem' }}>I accept the <a href="#" style={{ color: '#d97706', textDecoration: 'underline' }}>Terms and Conditions</a></span>
          </label>
          <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
            <input type="checkbox" checked={acceptComm} onChange={(e) => setAcceptComm(e.target.checked)} style={{ marginRight: '10px', marginTop: '4px' }} />
            <span style={{ fontSize: '0.9rem' }}>Yes, I agree to receive future communication on optional value added services offered by VFS Global</span>
          </label>
        </div>

        {/* Actions */}
        <div className="card-footer form-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            type="button" 
            style={{ padding: '0.75rem 2rem', borderRadius: '4px', border: '1px solid #d97706', color: '#d97706', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => navigate('/services')}
          >
            Go Back
          </button>
          <button
            type="button"
            disabled={!acceptTerms}
            style={{ 
              padding: '0.75rem 2rem', 
              borderRadius: '4px', 
              border: 'none', 
              backgroundColor: acceptTerms ? '#d97706' : '#fcd34d', 
              color: '#fff', 
              cursor: acceptTerms ? 'pointer' : 'not-allowed', 
              fontWeight: 'bold' 
            }}
            onClick={() => setShowDisclaimer(true)}
          >
            Pay Online
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
