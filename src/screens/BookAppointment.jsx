import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentDetails, applicants } = location.state || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [visibleSlots, setVisibleSlots] = useState(5);

  const steps = [
    { number: '✓', label: 'Appointment Details', active: false, completed: true },
    { number: '✓', label: 'Your Details', active: false, completed: true },
    { number: 3, label: 'Book Appointment', active: true },
    { number: 4, label: 'Services', active: false },
    { number: 5, label: 'Review', active: false },
  ];

  // Calendar mock data for August 2026
  const daysInMonth = 31;
  const startingDayOfWeek = 5; // Saturday (0=Mon, 1=Tue... 5=Sat)
  
  // Available dates based on screenshot
  const availableDates = [7, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 31];
  
  const allTimeSlots = [
    '08:00', '08:15', '08:30', '08:45', '09:00', 
    '09:15', '09:30', '09:45', '10:00', '10:15', 
    '10:30', '10:45', '11:00', '11:15', '11:30', 
    '11:45', '12:00', '12:15', '12:30', '12:45', 
    '13:00'
  ];
  
  const generateCalendarDays = () => {
    const days = [];
    
    // Empty slots before 1st of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const isAvailable = availableDates.includes(i);
      const isSelected = selectedDate === i;
      
      days.push(
        <div 
          key={i} 
          className={`calendar-day ${isAvailable ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            if (isAvailable) {
              setSelectedDate(i);
              setVisibleSlots(5); // Reset slots on new date selection
              setSelectedTime(null);
            }
          }}
        >
          {i}
        </div>
      );
    }
    
    return days;
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
          <span className="total-value">INR 2,065.00</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="appointment-card">
        <div className="card-header">
          <span className="mandatory-text">Complete the fields as requested</span>
          <h2>Book an Appointment</h2>
          <p className="subtitle-text">First choose the type of appointment you would like, followed by your preferred date. You will then be able to select from all the time slots currently available on that day.</p>
        </div>

        <div className="form-content">
          <h3 className="section-title">Pick an Appointment Type</h3>
          <div className="appointment-type-selector">
            <div className="type-option selected">
              <div className="radio-circle">
                <div className="radio-inner"></div>
              </div>
              <span>Choose a slot</span>
            </div>
          </div>

          <h3 className="section-title">Pick an appointment date</h3>
          
          <div className="legend-container">
            <div className="legend-item">
              <div className="legend-box available-box"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-box unavailable-box"></div>
              <span>Unavailable</span>
            </div>
          </div>

          <div className="calendar-container">
            <div className="calendar-header">
              <button className="calendar-nav-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
              </button>
              <h4 className="calendar-month">August 2026</h4>
              <button className="calendar-nav-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </button>
            </div>
            
            <div className="calendar-grid">
              <div className="calendar-weekday">MON</div>
              <div className="calendar-weekday">TUE</div>
              <div className="calendar-weekday">WED</div>
              <div className="calendar-weekday">THU</div>
              <div className="calendar-weekday">FRI</div>
              <div className="calendar-weekday">SAT</div>
              <div className="calendar-weekday">SUN</div>
              
              {generateCalendarDays()}
            </div>
          </div>

          {selectedDate && (
            <div className="time-slots-section">
              <h3 className="section-title">Choose an appointment time</h3>
              
              <div className="time-filter-wrapper">
                <select className="custom-select time-filter" defaultValue="all">
                  <option value="all">All</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                </select>
              </div>

              <div className="time-slots-table">
                <div className="time-row header-row">
                  <div className="time-col">Time</div>
                  <div className="slot-col">
                    <div className="slot-type">Standard</div>
                    <div className="slot-availability">Available</div>
                  </div>
                </div>
                <div className="time-row subheader-row">
                  <div className="time-col"></div>
                  <div className="slot-col">
                    <div className="slot-desc">Appointments within usual opening hours</div>
                  </div>
                </div>

                {allTimeSlots.slice(0, visibleSlots).map((time) => (
                  <div key={time} className="time-row data-row">
                    <div className="time-col">{time}</div>
                    <div className="slot-col">
                      <button 
                        className={`btn-select-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}

                {visibleSlots < allTimeSlots.length && (
                  <button 
                    className="btn-load-more"
                    onClick={() => setVisibleSlots(prev => Math.min(prev + 5, allTimeSlots.length))}
                  >
                    Load More
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="card-footer form-actions" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn-cancel" onClick={() => navigate('/your-details')}>Go Back</button>
            <button 
              type="button" 
              className="btn-save" 
              disabled={!selectedTime}
              style={{ opacity: !selectedTime ? 0.6 : 1, cursor: !selectedTime ? 'not-allowed' : 'pointer' }}
              onClick={() => navigate('/services', {
                state: {
                  appointmentDetails,
                  applicants,
                  booking: {
                    date: `${selectedDate} August 2026`,
                    time: selectedTime
                  }
                }
              })}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
