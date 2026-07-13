const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL Database');
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

// --- API ROUTES ---

// 1. User Registration (SignUp)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // By default, new registrations are 'user' role
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, email, hashedPassword, 'user'], (err, result) => {
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
    const isMatch = await bcrypt.compare(password, user.password);
    
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

// 3. Save Entire Appointment Flow (Details + Applicants + Booking Time)
app.post('/api/appointments/submit', authenticateToken, (req, res) => {
  const { appointmentDetails, applicants, bookingData } = req.body;
  const userId = req.user.id;

  // Start a MySQL transaction
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    // 1. Insert Appointment
    const apptSql = 'INSERT INTO appointments (user_id, centre, category, sub_category) VALUES (?, ?, ?, ?)';
    db.query(apptSql, [userId, appointmentDetails.centre, appointmentDetails.category, appointmentDetails.subCategory], (err, apptResult) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
      
      const appointmentId = apptResult.insertId;

      // 2. Insert all Applicants
      const applicantSql = `INSERT INTO applicants (appointment_id, first_name, last_name, gender, dob, nationality, passport_number, passport_expiry, phone_code, phone_number, email, address_line_1, address_line_2, state, city, postcode) VALUES ?`;
      
      const applicantValues = applicants.map(app => [
        appointmentId, app.firstName, app.lastName, app.gender, app.dob, app.nationality, app.passport_number, app.passport_expiry, app.phone_code, app.phone_number, app.email, app.address_line_1, app.address_line_2, app.state, app.city, app.postcode
      ]);

      db.query(applicantSql, [applicantValues], (err, applicantResult) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

        // 3. Insert Booking Date/Time
        const bookSql = 'INSERT INTO bookings (appointment_id, selected_date, selected_time, total_amount) VALUES (?, ?, ?, ?)';
        db.query(bookSql, [appointmentId, bookingData.date, bookingData.time, bookingData.totalAmount], (err, bookResult) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

          // Commit Transaction
          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
            res.status(201).json({ message: 'Appointment submitted successfully', appointmentId });
          });
        });
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
