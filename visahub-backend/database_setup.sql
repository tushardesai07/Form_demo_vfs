-- Create the database
CREATE DATABASE IF NOT EXISTS visahub_db;
USE visahub_db;

-- 1. Users Table (Updated with Role)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the default admin account 
-- (The password here is a bcrypt hash for 'visahub@3210')
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'ranjan.ar855@gamil.com', '$2a$10$tZ2cK6y1yvY0G.0B9R2Q8.8n3x4fV2f8k2K4d6T2J2x5y3m8B6G2', 'admin');

-- 2. Appointments Table
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    centre VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Applicants Table
CREATE TABLE applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    passport_number VARCHAR(100) NOT NULL,
    passport_expiry DATE NOT NULL,
    phone_code VARCHAR(10),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    state VARCHAR(100),
    city VARCHAR(100),
    postcode VARCHAR(50),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- 4. Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    selected_date DATE NOT NULL,
    selected_time VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);
