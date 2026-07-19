const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Connected to DB");

    // 1. Appointments Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        centre VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        sub_category VARCHAR(255) NOT NULL,
        booking_date VARCHAR(100) NOT NULL,
        booking_time VARCHAR(50) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Paid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if user_id column exists
    const [columns] = await connection.query("SHOW COLUMNS FROM appointments LIKE 'user_id'");
    if (columns.length === 0) {
      await connection.query("ALTER TABLE appointments ADD COLUMN user_id INT AFTER id");
      console.log("Added user_id column to appointments");
    }

    // 2. Applicants Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS applicants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        gender VARCHAR(20),
        dob DATE,
        nationality VARCHAR(50),
        passport_number VARCHAR(100) NOT NULL,
        passport_expiry DATE,
        phone_code VARCHAR(10),
        phone_number VARCHAR(50),
        email VARCHAR(150),
        address_line_1 VARCHAR(255),
        address_line_2 VARCHAR(255),
        state VARCHAR(100),
        city VARCHAR(100),
        postcode VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
      )
    `);

    // 3. Appointment Services Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointment_services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL,
        service_id VARCHAR(100) NOT NULL,
        service_title VARCHAR(255) NOT NULL,
        service_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
      )
    `);

    // 4. Payments Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL,
        transaction_id VARCHAR(100) NOT NULL,
        cardholder_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
      )
    `);

    console.log("Database setup complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error setting up DB:", err);
    process.exit(1);
  }
}

setupDb();
