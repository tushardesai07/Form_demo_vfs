import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentDetails, applicants, booking, addedServicesList, totalAmount = 2065.00 } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (!location.state || !location.state.appointmentDetails || !location.state.appointmentDetails.centre) {
      alert("Session expired or missing appointment details. Please restart your booking.");
      navigate('/dashboard');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (activeTab === 'upi' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const formData = new FormData(e.target);
    const cardholderName = formData.get('cardholderName') || 'Unknown';
    const transactionId = `TXN-${Math.floor(Math.random() * 90000000) + 10000000}`;
    
    const paymentDetails = {
      cardholderName,
      transactionId,
      paymentMethod: activeTab // 'cards', 'netbanking', 'wallet', or 'upi'
    };
    
    try {
      const response = await fetch('https://visahub.atlantechglobal.com/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming user might have a token in localStorage
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          appointmentDetails,
          applicants,
          booking,
          addedServicesList,
          totalAmount,
          paymentDetails
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const result = await response.json();
      
      const newAppointment = {
        id: result.appointmentId || `VFS-${Math.floor(Math.random() * 9000) + 1000}`,
        name: applicants?.[0]?.firstName ? `${applicants[0].firstName} ${applicants[0].lastName}` : 'TUSHAR DESAI',
        type: appointmentDetails?.category || 'Short Term Visa',
        status: 'Paid',
        date: booking?.date || '15 Jul, 2026',
        time: booking?.time || '10:30 AM'
      };

      alert("Payment Successful! Your appointment is booked.");
      navigate('/dashboard', { state: { newAppointment } });
    } catch (err) {
      console.error(err);
      alert("Error booking appointment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#e6f0f9', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0056b3' }}>
        <h1 style={{ color: '#0056b3', margin: 0, fontSize: '1.5rem', fontWeight: 'normal' }}>VFS Global Services</h1>
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#333' }}>
          <div>Reference No : <strong>GEB72331016894</strong></div>
          <div style={{ color: '#0056b3', fontSize: '1rem', marginTop: '2px' }}>Amount : <strong>{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '40px auto', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #ddd', backgroundColor: '#0088cc' }}>
          <div onClick={() => setActiveTab('cards')} style={{ flex: 1, textAlign: 'center', padding: '15px 0', backgroundColor: activeTab === 'cards' ? '#fff' : 'transparent', color: activeTab === 'cards' ? '#333' : '#fff', fontWeight: activeTab === 'cards' ? 'bold' : 'normal', borderTop: activeTab === 'cards' ? '3px solid #0056b3' : 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>💳</div>
            <div style={{ fontSize: '0.75rem' }}>CARDS</div>
          </div>
          <div onClick={() => setActiveTab('netbanking')} style={{ flex: 1, textAlign: 'center', padding: '15px 0', backgroundColor: activeTab === 'netbanking' ? '#fff' : 'transparent', color: activeTab === 'netbanking' ? '#333' : '#fff', fontWeight: activeTab === 'netbanking' ? 'bold' : 'normal', borderTop: activeTab === 'netbanking' ? '3px solid #0056b3' : 'none', borderLeft: '1px solid #0077b3', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>🖱️</div>
            <div style={{ fontSize: '0.75rem' }}>NET BANKING</div>
          </div>
          <div onClick={() => setActiveTab('wallet')} style={{ flex: 1, textAlign: 'center', padding: '15px 0', backgroundColor: activeTab === 'wallet' ? '#fff' : 'transparent', color: activeTab === 'wallet' ? '#333' : '#fff', fontWeight: activeTab === 'wallet' ? 'bold' : 'normal', borderTop: activeTab === 'wallet' ? '3px solid #0056b3' : 'none', borderLeft: '1px solid #0077b3', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>👛</div>
            <div style={{ fontSize: '0.75rem' }}>WALLET/CASH CARD</div>
          </div>
          <div onClick={() => setActiveTab('upi')} style={{ flex: 1, textAlign: 'center', padding: '15px 0', backgroundColor: activeTab === 'upi' ? '#fff' : 'transparent', color: activeTab === 'upi' ? '#333' : '#fff', fontWeight: activeTab === 'upi' ? 'bold' : 'normal', borderTop: activeTab === 'upi' ? '3px solid #0056b3' : 'none', borderLeft: '1px solid #0077b3', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>UPI</div>
            <div style={{ fontSize: '0.75rem' }}>UPI</div>
          </div>
        </div>

        {/* Card Content */}
        <form onSubmit={handlePayment} style={{ padding: '30px' }}>
          {activeTab === 'cards' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.9rem', color: '#333' }}>Pay using</span>
                <span style={{ padding: '2px 5px', border: '1px solid #ccc', borderRadius: '2px', fontSize: '0.7rem', color: '#1a1a1a', fontWeight: 'bold' }}>VISA</span>
                <span style={{ padding: '2px 5px', border: '1px solid #ccc', borderRadius: '2px', fontSize: '0.7rem', color: '#1a1a1a', fontWeight: 'bold', backgroundColor: '#f8f8f8' }}>MasterCard</span>
                <span style={{ padding: '2px 5px', border: '1px solid #ccc', borderRadius: '2px', fontSize: '0.7rem', color: '#1a1a1a', fontWeight: 'bold', backgroundColor: '#f8f8f8' }}>Maestro</span>
                <span style={{ padding: '2px 5px', border: '1px solid #ccc', borderRadius: '2px', fontSize: '0.7rem', color: '#1a1a1a', fontWeight: 'bold', backgroundColor: '#f8f8f8' }}>RuPay</span>
              </div>

              <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#555', marginBottom: '20px' }}>
                For Maestro cards, please enter Expiry Date and CVV no. if available or else ignore and proceed.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', fontSize: '0.9rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" name="cardType" defaultChecked style={{ marginRight: '5px' }} /> Credit card
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" name="cardType" style={{ marginRight: '5px' }} /> Debit card
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px', alignItems: 'center', maxWidth: '500px', margin: '0 auto 25px auto' }}>
                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>Select Credit Card Option :</div>
                <select required className="custom-select" style={{ padding: '5px', fontSize: '0.9rem', border: '1px solid #ccc', borderRadius: '3px', width: '100%' }}>
                  <option value="mastercard">MasterCard</option>
                  <option value="visa">Visa</option>
                  <option value="amex">American Express</option>
                </select>

                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>Card number : <span style={{ color: 'red' }}>*</span></div>
                <div style={{ position: 'relative' }}>
                  <input type="text" required placeholder="Enter Your Card Number" style={{ width: '100%', padding: '5px 30px 5px 5px', fontSize: '0.9rem', border: '1px solid #ccc', borderRadius: '3px' }} />
                  <span style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: '#666' }}>🔢</span>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>Card holder name : <span style={{ color: 'red' }}>*</span></div>
                <input type="text" name="cardholderName" required placeholder="Enter Card Holder Name" style={{ width: '100%', padding: '5px', fontSize: '0.9rem', border: '1px solid #ccc', borderRadius: '3px' }} />

                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>Expiry date : <span style={{ color: 'red' }}>*</span></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select required style={{ padding: '5px', fontSize: '0.9rem', border: '1px solid #ccc', borderRadius: '3px', flex: 1 }}>
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return <option key={month} value={month}>{month}</option>;
                    })}
                  </select>
                  <select required style={{ padding: '5px', fontSize: '0.9rem', border: '1px solid #ccc', borderRadius: '3px', flex: 1 }}>
                    <option value="">YYYY</option>
                    {Array.from({ length: 15 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>CVV number : <span style={{ color: 'red' }}>*</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ position: 'relative', width: '100px' }}>
                    <input type="password" required maxLength="4" style={{ width: '100%', padding: '5px 25px 5px 5px', fontSize: '0.9rem', border: '1px solid #ccc', borderRadius: '3px' }} />
                    <span style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#666' }}>🔢</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', color: '#666', border: '1px solid #ccc', borderRadius: '4px', padding: '0 5px' }}>💳</div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'netbanking' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '25px', minHeight: '150px', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#333' }}>Select Bank and Proceed</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: '#333' }}>Select Bank :</span>
                <select required className="custom-select" style={{ width: '250px', padding: '5px', fontSize: '0.9rem', border: '1px solid #ccc', borderRadius: '3px' }}>
                  <option value="">--Select--</option>
                  <option value="axis-corp">Axis Corporate Bank</option>
                  <option value="bob-corp">Bank of Baroda Corporate</option>
                  <option value="bob-retail">Bank of Baroda Retail</option>
                  <option value="boi-corp">Bank of India Corporate</option>
                  <option value="boi-retail">Bank of India Retail</option>
                  <option value="bom">Bank of Maharashtra</option>
                  <option value="canara">Canara Bank</option>
                  <option value="cbi">Central Bank of India</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '25px', minHeight: '150px', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#333' }}>Select your Wallet/Cash Card and proceed</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: '#333' }}>Select Option :</span>
                <select required className="custom-select" style={{ width: '250px', padding: '5px', fontSize: '0.9rem', border: '1px solid #ccc', borderRadius: '3px' }}>
                  <option value="">--Select--</option>
                  <option value="mobikwik">MobiKwik Wallet</option>
                  <option value="paytm">Paytm</option>
                  <option value="phonepe">PhonePe Wallet</option>
                  <option value="freecharge">Freecharge</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'upi' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px', minHeight: '200px' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
                <div style={{ border: '1px solid #d97706', padding: '2px 5px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontWeight: 'bold', color: '#333', fontSize: '0.8rem' }}>BHIM</span>
                  <span style={{ fontWeight: 'bold', color: '#0056b3', fontSize: '0.8rem', fontStyle: 'italic' }}>UPI</span>
                </div>
              </div>
              
              <span style={{ fontSize: '0.95rem', color: '#333', marginBottom: '15px' }}>Pay Through UPI QR Code</span>
              
              <div style={{ border: '2px solid #000', padding: '5px', marginBottom: '10px' }}>
                {/* Simulated QR Code using emoji grid for visual representation */}
                <div style={{ fontSize: '5rem', lineHeight: 1 }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=vfsglobal@upi" alt="QR Code" width="120" height="120" />
                </div>
              </div>
              
              <div style={{ fontSize: '0.75rem', color: '#333', fontStyle: 'italic', marginBottom: '5px', textAlign: 'center' }}>
                QR Code expire in<br/>
                <strong>{formatTime(timeLeft)}</strong>
              </div>
              
              <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                Now you can easily scan and pay using various upi app
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.6rem', color: '#999', textTransform: 'uppercase' }}>POWERED BY</span>
                <span style={{ fontWeight: 'bold', color: '#0056b3', fontSize: '1rem', fontStyle: 'italic' }}>UPI</span>
              </div>
            </div>
          )}

          {activeTab !== 'upi' && (
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  background: 'linear-gradient(to bottom, #4cb8c4, #3cd3ad)',
                  backgroundColor: '#3498db',
                  backgroundImage: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 40px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '350px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? 'PROCESSING...' : 'PAY NOW'}
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/review', { state: { appointmentDetails, applicants, booking, addedServicesList, totalAmount }}); }} style={{ color: '#0056b3', textDecoration: 'underline', fontSize: '0.85rem' }}>
              Cancel
            </a>
          </div>

          {activeTab === 'upi' && (
            <div style={{ marginTop: '20px', paddingLeft: '20px', fontSize: '0.8rem', color: '#333' }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li><strong>BHIM</strong> supported</li>
                <li>For list of all UPI supported banks please <a href="#" style={{ color: '#0056b3' }}>click here</a>.</li>
              </ul>
            </div>
          )}
        </form>

        {/* Footer */}
        <div style={{ backgroundColor: '#fafafa', borderTop: '1px solid #ddd', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #ccc', padding: '2px 5px', borderRadius: '3px' }}>VeriSign Secured</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #ccc', padding: '2px 5px', borderRadius: '3px', color: 'green' }}>SecureTrust</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #ccc', padding: '2px 5px', borderRadius: '3px', color: 'blue' }}>Verified by VISA</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #ccc', padding: '2px 5px', borderRadius: '3px', color: 'red' }}>MasterCard SecureCode</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#666', textAlign: 'right' }}>
              Powered by<br/>
              <strong style={{ color: '#00a39e', fontSize: '0.9rem' }}>WORLDLINE</strong>
            </div>
          </div>
          
          <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '10px', lineHeight: '1.4' }}>
            Your transaction is processed through a secure 2048 bit https internet connection based on secure socket layer technology. For security purposes, your following details have been logged.
          </p>
          <p style={{ fontSize: '0.7rem', color: '#333', fontWeight: 'bold', margin: 0 }}>
            IP address 2409:4081:281:bfe0:c576:852b:ff6d:df0b and access time {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST {new Date().getFullYear()}.
          </p>
        </div>
      </div>
    </div>
  );
}
