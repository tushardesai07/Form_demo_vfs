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
    navigate('/your-details', {
      state: {
        appointmentDetails: { centre, category, subCategory }
      }
    });
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
                onChange={(e) => { setCategory(e.target.value); setSubCategory(''); }}
                className="custom-select"
                disabled={!centre}
              >
                <option value="" disabled>Select your appointment category</option>
                {centre === 'pune' ? (
                  <>
                    <option value="airport-transit">Airport transit visa (A and C)</option>
                    <option value="national-d-stamping">National Visa (stay of more than 90 days): D-visa stamping</option>
                    <option value="schengen">Schengen Visa (stay of max. 90 days or less)</option>
                    <option value="trade-fair">Trade Fair Urgent</option>
                    <option value="urgent-business">Urgent Business</option>
                  </>
                ) : (
                  <>
                    <option value="airport-transit">Airport transit visa (A and C)</option>
                    <option value="national-reentry">National Visa (stay of more than 90 days): Re-entry</option>
                    <option value="national-employment">National Visa (stay of more than 90 days): Employment</option>
                    <option value="national-family">National Visa (stay of more than 90 days): Family Reunion</option>
                    <option value="national-student">National Visa (stay of more than 90 days): Student Visa</option>
                    <option value="national-training">National visa (stay of more than 90 days) - Employment / training</option>
                    <option value="national-d-stamping">National Visa (stay of more than 90 days): D-visa stamping</option>
                    <option value="schengen">Schengen Visa (stay of max. 90 days or less)</option>
                    <option value="trade-fair">Trade Fair Urgent</option>
                    <option value="urgent-business">Urgent Business</option>
                  </>
                )}
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
                    <option value="employment-academic">Employment as an academic (§ 18b AufenthG)</option>
                    <option value="employment-work-experience">Employment with work experience (19c AufenthG iVm 6 BeschV)</option>
                    <option value="quality-analysis">Conducting a quality analysis ((§ 16d Abs. 6 AufenthG)</option>
                    <option value="placement-agreement">Employment as part of a placement agreement (§ 16d AufenthG)</option>
                    <option value="fast-track">Fast track procedure acc to § 81a AufenthG</option>
                    <option value="ict-card">ICT card, deputation (§ 19 AufenthG)</option>
                    <option value="opportunity-card">Opportunity Card</option>
                    <option value="recognition-degree">Recognition of foreign professional degree</option>
                    <option value="researcher">Researcher</option>
                  </>
                ) : category === 'national-family' ? (
                  <>
                    <option value="d-family-reunion-parents">D - Family Reunion: Parents (in law)</option>
                    <option value="d-family-reunion-spouse">D - Family Reunion: Spouse / Child</option>
                    <option value="family-reunion-parent-other">Parent or any other family member joining a foreigner or German living in Germany</option>
                    <option value="family-reunion-spouse-child">Spouse and / or child of foreigner living in Germany</option>
                  </>
                ) : category === 'national-student' ? (
                  <>
                    <option value="studies-aps">Studies with APS certificate</option>
                    <option value="studies-specific">Studies with specific qualifications</option>
                  </>
                ) : category === 'national-reentry' ? (
                  <option value="re-entry">Re-entry</option>
                ) : category === 'national-d-stamping' ? (
                  <option value="d-visa-stamping">D-visa stamping</option>
                ) : category === 'schengen' ? (
                  <>
                    <option value="schengen-business">Business</option>
                    <option value="schengen-culture">Culture Sport Religious</option>
                    <option value="schengen-health">Health</option>
                    <option value="schengen-scientist">Scientist</option>
                    <option value="schengen-seamen">Seamen</option>
                    <option value="schengen-tourism">Tourism</option>
                    <option value="schengen-trade-fair">Trade Fair</option>
                    <option value="schengen-training">Training</option>
                    <option value="schengen-visit">Visit (Family and Friends)</option>
                  </>
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

          {category === 'national-family' && subCategory === 'd-family-reunion-parents' && (
            <div className="info-banner" style={{ marginTop: '1.5rem', backgroundColor: '#e0f2fe', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #0284c7', fontSize: '0.875rem', color: '#0369a1', lineHeight: '1.5' }}>
              Since 01.03.2024, family reunion is possible for parents (in law) even in cases of no exceptional hardship. This only applies if your daughter (in law) or son (in law) has received one of the following residence permits or visas for the first time on or after 01.03.2024: - EU Blue Card - (Mobile) ICT Card - Skilled worker acc. to §§ 18a, 18b, 18c III AufenthG - Scientist acc. to §§ 18d, 18f AufenthG - Senior employee, manager, company specialist, scientist, visiting scientist, engineer or technician in the research team of a visiting scientist or as a teacher acc. to § 19c I AufenthG - Employment acc. to § 19c II or IV 1 AufenthG - Self-employed acc. to § 21 AufenthG - German Residence Act Please note that this regulation does not apply to you if your son or daughter (in law) already received one of the above-mentioned residence titles before 01.03.2024! To schedule an appointment, please contact the responsible mission. Kindly contact us via e-mail. You can find...
            </div>
          )}

          {category === 'national-d-stamping' && subCategory === 'd-visa-stamping' && (
            <div className="info-banner" style={{ marginTop: '1.5rem', backgroundColor: '#e0f2fe', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid #0284c7', fontSize: '0.875rem', color: '#0369a1', lineHeight: '1.5' }}>
              We are sorry but no appointment slots are currently available. New slots open at regular intervals, please try again later
            </div>
          )}
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
