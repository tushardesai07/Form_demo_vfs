import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function YourDetails() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  
  const [countdown, setCountdown] = useState(44);
  const [isSaved, setIsSaved] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const [applicants, setApplicants] = useState([]);
  
  // Current form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Start timer whenever we are NOT in saved view
  useEffect(() => {
    if (isSaved) return;
    
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, isSaved]);

  const handleFormChange = () => {
    if (formRef.current) {
      setIsFormValid(formRef.current.checkValidity());
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (countdown > 0 && !isFormValid) return;
    
    // Save current applicant
    const newApplicant = {
      id: Date.now(),
      firstName: firstName || "TUSHAR",
      lastName: lastName || "DESAI"
    };
    
    setApplicants([...applicants, newApplicant]);
    setIsSaved(true);
  };

  const handleAddAnother = () => {
    // Reset form fields
    setFirstName('');
    setLastName('');
    setCountdown(44); // Reset timer for new applicant
    setIsSaved(false);
  };

  const handleCancel = () => {
    navigate('/appointment');
  };

  const handleEdit = (id) => {
    // Basic edit logic: in a real app, populate form fields with selected applicant data
    setIsSaved(false);
  };

  const handleDelete = (id) => {
    setApplicants(applicants.filter(app => app.id !== id));
  };

  const handleFinalContinue = () => {
    navigate('/book-appointment');
  };

  const steps = [
    { number: '✓', label: 'Appointment Details', active: false, completed: true },
    { number: 2, label: 'Your Details', active: true },
    { number: 3, label: 'Book Appointment', active: false },
    { number: 4, label: 'Services', active: false },
    { number: 5, label: 'Review', active: false },
  ];

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
        {isSaved && (
          <div className="total-amount">
            <span className="total-label">Total amount</span>
            <span className="total-value">INR {(2065.00 * (applicants.length || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className="appointment-card">
        {!isSaved ? (
          <>
            <div className="card-header">
              <span className="mandatory-text">Complete the fields as requested</span>
              <h2>Your Details</h2>
              
              <div className="warning-messages">
                {countdown > 0 ? (
                  <p className="warning-text">Warning: Please wait {countdown} seconds before saving your details and continuing</p>
                ) : null}
                <p className="warning-text">IMPORTANT: Please enter the information exactly as it appears on the photo page of your passport. We may be unable to provide services if the details you enter do not match your passport.</p>
              </div>
            </div>

            {applicants.length > 0 && (
              <div className="applicants-list" style={{ marginBottom: '2rem' }}>
                {applicants.map((applicant, index) => (
                  <div key={applicant.id} className="applicant-summary-box" style={{ background: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <div className="applicant-info">
                      <span className="applicant-label">Applicant {index + 1}</span>
                      <span className="applicant-name" style={{ color: '#64748b' }}>
                        {applicant.firstName.toUpperCase()} {applicant.lastName.toUpperCase()}
                      </span>
                    </div>
                    <div className="applicant-actions">
                      <button type="button" className="icon-btn delete-btn" onClick={() => handleDelete(applicant.id)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <h3 className="section-title" style={{ marginTop: 0 }}>Applicant {applicants.length + 1}</h3>
            </div>

            <form ref={formRef} onSubmit={handleSave} onChange={handleFormChange} className="form-content details-form">
              <div className="form-group-app">
                <label>First Name<span className="asterisk">*</span></label>
                <input 
                  type="text" 
                  className="custom-input" 
                  placeholder="ENTER YOUR FIRST NAME" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group-app">
                <label>Last Name<span className="asterisk">*</span></label>
                <input 
                  type="text" 
                  className="custom-input" 
                  placeholder="PLEASE ENTER LAST NAME." 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>

              <div className="grid-2-cols">
                <div className="form-group-app">
                  <label>Gender<span className="asterisk">*</span></label>
                  <div className="select-wrapper">
                    <select className="custom-select" defaultValue="" required>
                      <option value="" disabled>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group-app">
                  <label>Date Of Birth<span className="asterisk">*</span></label>
                  <input 
                    type="date" 
                    className="custom-input date-input" 
                    onClick={(e) => {
                      try { e.target.showPicker() } catch (err) { /* ignore */ }
                    }}
                    required 
                  />
                </div>
              </div>

              <div className="form-group-app">
                <label>Current Nationality<span className="asterisk">*</span></label>
                <div className="select-wrapper">
                  <select className="custom-select" defaultValue="" required>
                    <option value="" disabled>Select</option>
                    <option value="in">India</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                  </select>
                </div>
              </div>

              <div className="form-group-app">
                <label>Passport Number<span className="asterisk">*</span></label>
                <input type="text" className="custom-input" placeholder="ENTER PASSPORT NUMBER" required />
              </div>

              <div className="form-group-app">
                <label>Passport Expiry Date<span className="asterisk">*</span></label>
                <input 
                  type="date" 
                  className="custom-input date-input" 
                  onClick={(e) => {
                    try { e.target.showPicker() } catch (err) { /* ignore */ }
                  }}
                  required 
                />
              </div>

              <div className="form-group-app">
                <label>Contact number<span className="asterisk">*</span></label>
                <div className="contact-inputs">
                  <input type="text" className="custom-input phone-code" placeholder="44" defaultValue="44" required />
                  <input type="text" className="custom-input phone-number" placeholder="012345648382" required />
                </div>
              </div>

              <div className="form-group-app">
                <label>Email<span className="asterisk">*</span></label>
                <input type="email" className="custom-input" placeholder="ENTER EMAIL ADDRESS" required />
              </div>

              <div className="form-group-app">
                <label>Address line 1<span className="asterisk">*</span></label>
                <input type="text" className="custom-input" placeholder="ENTER ADDRESS LINE 1" required />
              </div>

              <div className="form-group-app">
                <label>Address line 2<span className="asterisk">*</span></label>
                <input type="text" className="custom-input" placeholder="ENTER ADDRESS LINE 2" required />
              </div>

              <div className="form-group-app">
                <label>State<span className="asterisk">*</span></label>
                <input type="text" className="custom-input" placeholder="ENTER STATE NAME" required />
              </div>

              <div className="form-group-app">
                <label>City<span className="asterisk">*</span></label>
                <input type="text" className="custom-input" placeholder="ENTER CITY NAME" required />
              </div>

              <div className="form-group-app">
                <label>Postcode<span className="asterisk">*</span></label>
                <input type="text" className="custom-input" placeholder="ENTER YOUR POSTCODE" required />
              </div>

              <div className="card-footer form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn-save" 
                  disabled={countdown > 0 && !isFormValid}
                  style={{ opacity: (countdown > 0 && !isFormValid) ? 0.5 : 1, cursor: (countdown > 0 && !isFormValid) ? 'not-allowed' : 'pointer' }}
                >
                  Save
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="summary-view">
            <div className="card-header summary-header">
              <span className="mandatory-text">You must book appointments individually</span>
              <h2>Your Details Summary</h2>
            </div>
            
            <div className="applicants-list">
              {applicants.map((applicant, index) => (
                <div key={applicant.id} className="applicant-summary-box">
                  <div className="applicant-info">
                    <span className="applicant-label">Applicant {index + 1}</span>
                    <span className="applicant-name">
                      {applicant.firstName.toUpperCase()} {applicant.lastName.toUpperCase()}
                    </span>
                  </div>
                  <div className="applicant-actions">
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(applicant.id)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                    <button className="icon-btn edit-btn" onClick={() => handleEdit(applicant.id)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-applicant-row">
              <button className="btn-add-applicant" onClick={handleAddAnother}>Add another applicant</button>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="info-text">
                A service fee of INR 2065.00 is applicable to attend a VFS Centre which is different from the Visa Fee. Check the VFS Global or embassy websites for further information.
              </div>
            </div>

            <div className="card-footer form-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsSaved(false)}>Go Back</button>
              <button type="button" className="btn-save" onClick={handleFinalContinue}>Continue</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
