import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentDetails, applicants = [], booking } = location.state || {};
  
  const baseAmount = 2065.00 * (applicants.length || 1);
  const [totalAmount, setTotalAmount] = useState(baseAmount);
  const [addedServices, setAddedServices] = useState({});
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'lowToHigh', 'highToLow'

  const steps = [
    { number: '✓', label: 'Appointment Details', active: false, completed: true },
    { number: '✓', label: 'Your Details', active: false, completed: true },
    { number: '✓', label: 'Book Appointment', active: false, completed: true },
    { number: 4, label: 'Services', active: true },
    { number: 5, label: 'Review', active: false },
  ];

  const services = [
    {
      id: 'travel-insurance',
      title: 'Travel Assistance with Insurance',
      desc: 'Travel Insurance is mandatory for your Schengen Visa ...',
      price: 0.00,
      popularity: 1
    },
    {
      id: 'premium-lounge',
      title: 'Premium Lounge',
      desc: 'The VFS Premium Service Lounge is available at the visa application cente...',
      price: 3298.00,
      popularity: 2
    },
    {
      id: 'courier-assurance',
      title: 'Courier Assurance Service',
      desc: 'This is an optional top-up insurance that you can purchase with a couri...',
      price: 1033.00,
      popularity: 3
    },
    {
      id: 'courier-fees',
      title: 'Courier Fees',
      desc: 'Get your documents delivered quickly and directly to your home or office ...',
      price: 733.00,
      popularity: 4
    },
    {
      id: 'prime-time',
      title: 'Prime Time Collection',
      desc: 'Collect your Passport/Application beyond the normal processing hour...',
      price: 520.00,
      popularity: 5
    },
    {
      id: 'sms-updates',
      title: 'SMS Update Service',
      desc: 'Stay up to date with automated SMS notifications on your visa application status...',
      price: 250.00,
      popularity: 6
    },
    {
      id: 'photo-booth',
      title: 'Photograph Service',
      desc: 'Get your photo taken at the Visa Application Centre to ensure it meets specifications...',
      price: 450.00,
      popularity: 7
    },
    {
      id: 'form-filling',
      title: 'Form Filling Assistance',
      desc: 'Dedicated staff member will assist you in filling your visa application form...',
      price: 1500.00,
      popularity: 8
    },
    {
      id: 'photocopy',
      title: 'Photocopying Service',
      desc: 'High quality photocopying service available at the application centre...',
      price: 15.00,
      popularity: 9
    },
    {
      id: 'printout',
      title: 'Document Printing',
      desc: 'Print your documents directly at the centre from your USB drive or email...',
      price: 25.00,
      popularity: 10
    }
  ];

  const sortedServices = useMemo(() => {
    // Only include services that are NOT added
    const list = services.filter(s => !addedServices[s.id]);

    if (sortBy === 'lowToHigh') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'highToLow') {
      return list.sort((a, b) => b.price - a.price);
    }
    // Default to popular (using our predefined popularity rank)
    return list.sort((a, b) => a.popularity - b.popularity);
  }, [sortBy, addedServices, services]);

  const addedServicesList = useMemo(() => {
    return services.filter(s => addedServices[s.id]);
  }, [addedServices, services]);

  const handleAddService = (service) => {
    if (addedServices[service.id]) {
      // Remove service
      const newAdded = { ...addedServices };
      delete newAdded[service.id];
      setAddedServices(newAdded);
      setTotalAmount(prev => prev - service.price);
    } else {
      // Add service
      setAddedServices({ ...addedServices, [service.id]: true });
      setTotalAmount(prev => prev + service.price);
    }
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

      {/* Main Card */}
      <div className="appointment-card">
        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
          <h2>All available Additional services</h2>

          <div className="sort-section">
            <span className="sort-label">Sort by</span>
            <div className="sort-options">
              <label className={`type-option sort-option ${sortBy === 'popular' ? 'selected' : ''}`} onClick={() => setSortBy('popular')}>
                <div className="radio-circle">
                  {sortBy === 'popular' && <div className="radio-inner"></div>}
                </div>
                <span>Popular</span>
              </label>
              <label className={`type-option sort-option ${sortBy === 'lowToHigh' ? 'selected' : ''}`} onClick={() => setSortBy('lowToHigh')}>
                <div className="radio-circle">
                  {sortBy === 'lowToHigh' && <div className="radio-inner"></div>}
                </div>
                <span>Price low to high</span>
              </label>
              <label className={`type-option sort-option ${sortBy === 'highToLow' ? 'selected' : ''}`} onClick={() => setSortBy('highToLow')}>
                <div className="radio-circle">
                  {sortBy === 'highToLow' && <div className="radio-inner"></div>}
                </div>
                <span>Price high to low</span>
              </label>
            </div>
          </div>
        </div>

        {addedServicesList.length > 0 && (
          <div className="services-list-container added-services-block" style={{ marginBottom: '2rem', border: '2px solid #10b981' }}>
            <div className="services-header-row" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
              <div className="service-name-col">Added Services</div>
              <div className="service-price-col">Unit Cost (INR)</div>
            </div>
            <div className="services-body" style={{ maxHeight: 'none', overflowY: 'visible' }}>
              {addedServicesList.map((service) => (
                <div key={service.id} className="service-item-row" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="service-info-col">
                    <h4 className="service-title">{service.title}</h4>
                    <p className="service-desc">{service.desc}</p>
                  </div>
                  <div className="service-action-col">
                    <div className="service-price">INR {service.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <button
                      className="btn-add-service added"
                      onClick={() => handleAddService(service)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="services-list-container">
          <div className="services-header-row">
            <div className="service-name-col">Services</div>
            <div className="service-price-col">Unit Cost (INR)</div>
          </div>

          <div className="services-body">
            {sortedServices.length > 0 ? sortedServices.map((service) => (
              <div key={service.id} className="service-item-row">
                <div className="service-info-col">
                  <h4 className="service-title">{service.title}</h4>
                  <p className="service-desc">{service.desc}</p>
                  <a href="#" className="read-more-link" onClick={(e) => e.preventDefault()}>Read more →</a>
                </div>
                <div className="service-action-col">
                  <div className="service-price">INR {service.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <button
                    className="btn-add-service"
                    onClick={() => handleAddService(service)}
                  >
                    Add
                  </button>
                </div>
              </div>
            )) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No additional services available.
              </div>
            )}
          </div>
        </div>

        <div className="card-footer form-actions" style={{ marginTop: '2rem' }}>
          <button type="button" className="btn-cancel" onClick={() => navigate('/book-appointment')}>Go Back</button>
          <button
            type="button"
            className="btn-save"
            onClick={() => navigate('/review', { 
              state: { 
                appointmentDetails, 
                applicants, 
                booking, 
                addedServicesList, 
                totalAmount 
              } 
            })}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
