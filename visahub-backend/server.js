const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Database Pool');
  connection.release();
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Health Check Route - Test this in browser first!
app.get('/api/health', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) return res.status(500).json({ status: 'DB Error', error: err.message });
    res.json({ status: 'OK', message: 'Server and Database are connected!' });
  });
});

// --- API ROUTES ---

// 1. User Registration (SignUp)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, email, password, 'user'], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'User registered successfully!' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. User/Admin Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    
    // Comparing plain text passwords
    const isMatch = (password === user.password);
    
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT containing user ID and role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '12h' }
    );

    res.json({ 
      message: `${user.role === 'admin' ? 'Admin' : 'User'} login successful`, 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  });
});

// 3. Create Appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  const { appointmentDetails, applicants, booking, addedServicesList, totalAmount, paymentDetails } = req.body;
  const userId = req.user.id;
  
  // Here we would typically insert into the database.
  // 1. Insert into appointments table
  // 2. Insert into applicants table for each applicant
  // 3. Insert into appointment_services for each added service
  
  if (!appointmentDetails || !appointmentDetails.centre) {
    return res.status(400).json({ error: 'Missing appointment details. Session might have expired.' });
  }

  try {
    const connection = await db.promise().getConnection();
    await connection.beginTransaction();

    try {
      // Create appointment record
      const [apptResult] = await connection.query(
        'INSERT INTO appointments (user_id, centre, category, sub_category, booking_date, booking_time, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, appointmentDetails.centre, appointmentDetails.category, appointmentDetails.subCategory, booking.date, booking.time, totalAmount, 'Paid']
      );
      
      const appointmentId = apptResult.insertId;

      // Insert applicants
      for (const applicant of applicants) {
        await connection.query(
          `INSERT INTO applicants 
          (appointment_id, first_name, last_name, gender, dob, nationality, passport_number, passport_expiry, phone_code, phone_number, email, address_line_1, address_line_2, state, city, postcode) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            appointmentId, applicant.firstName, applicant.lastName, applicant.gender, applicant.dob, applicant.nationality, 
            applicant.passportNumber, applicant.passportExpiry, applicant.phoneCode, applicant.phoneNumber, applicant.email, 
            applicant.addressLine1, applicant.addressLine2, applicant.state, applicant.city, applicant.postcode
          ]
        );
      }

      // Insert services if any
      if (addedServicesList && addedServicesList.length > 0) {
        for (const service of addedServicesList) {
          await connection.query(
            'INSERT INTO appointment_services (appointment_id, service_id, service_title, service_price) VALUES (?, ?, ?, ?)',
            [appointmentId, service.id, service.title, service.price]
          );
        }
      }

      // Insert payment details
      if (paymentDetails) {
        await connection.query(
          'INSERT INTO payments (appointment_id, transaction_id, cardholder_name, amount) VALUES (?, ?, ?, ?)',
          [appointmentId, paymentDetails.transactionId, paymentDetails.cardholderName, totalAmount]
        );
      }

      await connection.commit();
      connection.release();

      res.status(201).json({ message: 'Appointment successfully booked', appointmentId });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ error: 'Server error booking appointment' });
  }
});

// 4. Get All Appointments (For Admin Dashboard)
app.get('/api/appointments', authenticateToken, async (req, res) => {
  // In a real app, you might want to verify req.user.role === 'admin' here
  try {
    const connection = await db.promise().getConnection();
    
    const [allAppointments] = await connection.query('SELECT * FROM appointments ORDER BY created_at DESC');
    const [allApplicants] = await connection.query('SELECT * FROM applicants');
    
    // Combine appointments with their applicants
    const formattedData = allAppointments.map(appt => {
      return {
        ...appt,
        applicants: allApplicants.filter(a => a.appointment_id === appt.id)
      }
    });

    connection.release();
    res.json(formattedData);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Server error fetching appointments' });
  }
});

// 5. Get User's Appointments
app.get('/api/appointments/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await db.promise().getConnection();
    
    const [userAppointments] = await connection.query('SELECT * FROM appointments WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    
    if (userAppointments.length === 0) {
      connection.release();
      return res.json([]);
    }

    const appointmentIds = userAppointments.map(a => a.id);
    const [allApplicants] = await connection.query('SELECT * FROM applicants WHERE appointment_id IN (?)', [appointmentIds]);
    
    const formattedData = userAppointments.map(appt => {
      const apptApplicants = allApplicants.filter(a => a.appointment_id === appt.id);
      return {
        id: `VFS-${appt.id}`,
        rawId: appt.id,
        name: apptApplicants.length > 0 ? `${apptApplicants[0].first_name} ${apptApplicants[0].last_name}` : 'Applicant',
        type: appt.category,
        date: appt.booking_date,
        time: appt.booking_time,
        status: appt.status,
        centre: appt.centre,
        sub_category: appt.sub_category,
        total_amount: appt.total_amount,
        applicants: apptApplicants
      }
    });

    connection.release();
    res.json(formattedData);
  } catch (err) {
    console.error('Error fetching user appointments:', err);
    res.status(500).json({ error: 'Server error fetching user appointments' });
  }
});

// 6. Get All Users (For Admin Dashboard)
app.get('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  
  try {
    const connection = await db.promise().getConnection();
    const [users] = await connection.query('SELECT id, name, email, role FROM users');
    connection.release();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// 7. Update User Role (For Admin Dashboard)
app.put('/api/users/:id/role', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  
  const { id } = req.params;
  const { role } = req.body;
  
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const connection = await db.promise().getConnection();
    await connection.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    connection.release();
    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Server error updating user role' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
