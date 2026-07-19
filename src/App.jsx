import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Dashboard from './screens/Dashboard';
import AdminDashboard from './screens/AdminDashboard';
import AppointmentDetails from './screens/AppointmentDetails';
import YourDetails from './screens/YourDetails';
import BookAppointment from './screens/BookAppointment';
import Services from './screens/Services';
import Review from './screens/Review';
import Payment from './screens/Payment';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/appointment" element={<AppointmentDetails />} />
        <Route path="/your-details" element={<YourDetails />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/services" element={<Services />} />
        <Route path="/review" element={<Review />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
