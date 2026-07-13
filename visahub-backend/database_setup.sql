-- Create the database
CREATE DATABASE IF NOT EXISTS visahub_visahub_db;
USE visahub_visahub_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the default admin account (plain text password)
INSERT IGNORE INTO users (name, email, password, role) 
VALUES ('Admin', 'ranjan.ar855@gamil.com', 'visahub@3210', 'admin');
