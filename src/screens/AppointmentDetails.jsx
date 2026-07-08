import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AppointmentDetails() {
  const navigate = useNavigate();
  const [centre, setCentre] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  
  const [error, setError] = useState(true);

  const handleContinue = () => {
    if (!centre) {
      setError(true);
      return;
    }
    // Proceed to next step
    navigate('/your-details');
  };

  const steps = [
    { number: 1, label: 'Appointment Details', active: true },
    { number: 2, label: 'Your Details', active: false },
    { number: 3, label: 'Book Appointment', active: false },
    { number: 4, label: 'Services', active: false },
    { number: 5, label: 'Review', active: false },
  ];

  return (
    <div className="appointment-page">
      {/* Stepper */}
      <div className="stepper-container">
        {steps.map((step, idx) => (
          <div key={idx} className={`step ${step.active ? 'active' : ''}`}>
            <div className="step-number">{step.number}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="appointment-card">
        <div className="card-header">
          <span className="mandatory-text">All fields are mandatory</span>
          <h2>Appointment Details</h2>
          <p>
            Please provide information about the type of visa you wish to apply for. Be aware that the appointment category 
            Applicant 1 chooses will be applied to each of the applicants added to your appointment booking.
          </p>
        </div>

        <div className="form-content">
          <div className="form-group-app">
            <div className="label-row">
              <label>Choose your Application Centre<span className="asterisk">*</span></label>
              <span className="centre-count">22 Centre(s)</span>
            </div>
            {error && !centre && (
              <div className="error-message">Please select your centre</div>
            )}
            <div className={`select-wrapper ${error && !centre ? 'has-error' : ''}`}>
              <select 
                value={centre} 
                onChange={(e) => { setCentre(e.target.value); setError(false); }}
                className="custom-select"
              >
                <option value="" disabled>Choose your Application Centre</option>
                <option value="ahmedabad">Ahmedabad - Visa Application Centre</option>
                <option value="bangalore-consulate">Bangalore - Consulate General Of Germany</option>
                <option value="bangalore-visa">Bangalore - Germany Visa Application Centre</option>
                <option value="chandigarh">Chandigarh - Visa Application Centre</option>
                <option value="chennai-consulate">Chennai - Consulate General Of Germany</option>
                <option value="chennai-visa">Chennai - Visa Application Centre</option>
                <option value="cochin">Cochin - Visa Application Centre</option>
                <option value="coimbatore">Coimbatore - Visa Application Centre</option>
                <option value="gurgaon">Gurgaon - Visa Application Centre</option>
                <option value="hyderabad">Hyderabad - Germany Visa Application Centre</option>
                <option value="jaipur">Jaipur - Visa Application Centre</option>
                <option value="jalandhar">Jalandhar - Visa Application Centre</option>
                <option value="kolkata-consulate">Kolkata - Consulate General Of Germany</option>
                <option value="kolkata-visa">Kolkata - Visa Application Centre</option>
                <option value="mumbai-consulate">Mumbai - Consulate General Of Germany</option>
                <option value="mumbai-visa">Mumbai - Germany Visa Application Centre</option>
                <option value="newdelhi-embassy">New Delhi - The Embassy Germany</option>
                <option value="newdelhi-visa">New Delhi - Visa Application Centre</option>
                <option value="panaji">Panaji - Visa Application Centre</option>
                <option value="puducherry">Puducherry - Germany Visa Application Centre</option>
                <option value="pune">Pune - Visa Application Centre</option>
                <option value="trivandrum">Trivandrum - Visa Application Centre</option>
              </select>
            </div>
          </div>

          <div className="form-group-app">
            <label>Choose your appointment category<span className="asterisk">*</span></label>
            <div className="select-wrapper">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="custom-select"
              >
                <option value="" disabled>Select your appointment category</option>
                <option value="airport-transit">Airport transit visa (A and C)</option>
                <option value="national-reentry">National Visa (stay of more than 90 days): Re-entry</option>
                <option value="national-employment">National Visa (stay of more than 90 days): Employment</option>
                <option value="national-family">National Visa (stay of more than 90 days): Family Reunion</option>
                <option value="national-student">National Visa (stay of more than 90 days): Student Visa</option>
                <option value="national-training">National visa (stay of more than 90 days) - Employment / training</option>
                <option value="schengen">Schengen Visa (stay of max. 90 days or less)</option>
                <option value="trade-fair">Trade Fair Urgent</option>
                <option value="urgent-business">Urgent Business</option>
              </select>
            </div>
          </div>

          <div className="form-group-app">
            <label>Choose your sub-category<span className="asterisk">*</span></label>
            <div className="select-wrapper">
              <select 
                value={subCategory} 
                onChange={(e) => setSubCategory(e.target.value)}
                className="custom-select"
                disabled={!category}
              >
                <option value="" disabled>Select your sub-category</option>
                {category === 'national-employment' ? (
                  <>
                    <option value="any-other">Any Other Employment</option>
                    <option value="au-pair">Au Pair</option>
                    <option value="basic-vocational">Basic or advanced in-company or school-based vocational training (§ 16a AufenthG)</option>
                    <option value="blue-card">Blue Card (§ 18g AufenthG)</option>
                    <option value="quality-analysis">Conducting a quality analysis ((§ 16d Abs. 6 AufenthG)</option>
                    <option value="placement-agreement">Employment as part of a placement agreement (§ 16d AufenthG)</option>
                    <option value="fast-track">Fast track procedure acc to § 81a AufenthG</option>
                    <option value="ict-card">ICT card, deputation (§ 19 AufenthG)</option>
                    <option value="opportunity-card">Opportunity Card</option>
                    <option value="recognition-degree">Recognition of foreign professional degree</option>
                    <option value="researcher">Researcher</option>
                  </>
                ) : category === 'national-reentry' ? (
                  <option value="re-entry">Re-entry</option>
                ) : category === 'airport-transit' ? (
                  <option value="airport-transit">Airport transit visa (A and C)</option>
                ) : (
                  <>
                    <option value="short">Short Stay (less than 90 days)</option>
                    <option value="long">Long Stay (more than 90 days)</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="card-footer form-actions">
          <button className="btn-cancel" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
