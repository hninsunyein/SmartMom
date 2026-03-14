-- Smart Mom System Database Initialization
-- Create database and user
CREATE DATABASE IF NOT EXISTS smart_mom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_mom_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  user_type ENUM('parent', 'advisor') NOT NULL,
  age INT,
  phone VARCHAR(20),
  specialty VARCHAR(100),
  license_number VARCHAR(100),
  experience_years INT,
  approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Advisor Availability Table
CREATE TABLE IF NOT EXISTS advisor_availability (
  id INT PRIMARY KEY AUTO_INCREMENT,
  advisor_id INT NOT NULL,
  day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (advisor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Children Table
CREATE TABLE IF NOT EXISTS children (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  blood_type VARCHAR(10),
  allergies TEXT,
  medical_conditions TEXT,
  medications TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NOT NULL,
  advisor_id INT NOT NULL,
  child_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id),
  FOREIGN KEY (advisor_id) REFERENCES users(id),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Growth Tracking Table
CREATE TABLE IF NOT EXISTS growth_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  child_id INT NOT NULL,
  measurement_date DATE NOT NULL,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  bmi DECIMAL(5,2),
  head_circumference DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Nutrition Plans Table
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  child_id INT NOT NULL,
  plan_date DATE NOT NULL,
  breakfast TEXT,
  lunch TEXT,
  dinner TEXT,
  snacks TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  child_id INT NOT NULL,
  milestone_type ENUM('physical', 'cognitive', 'social', 'emotional') NOT NULL,
  milestone_name VARCHAR(255) NOT NULL,
  expected_age_months INT,
  achieved BOOLEAN DEFAULT FALSE,
  achieved_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Insert sample data for testing
-- Note: Password for both test users is: password (hashed with bcrypt)
INSERT IGNORE INTO users (id, email, password, full_name, user_type, age, approval_status) VALUES
(1, 'parent@smartmom.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Johnson', 'parent', 32, 'approved'),
(2, 'advisor@smartmom.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Emily Davis', 'advisor', 38, 'approved');

-- Insert sample child for testing
INSERT IGNORE INTO children (id, parent_id, name, date_of_birth, gender, blood_type, allergies) VALUES
(1, 1, 'Emma Johnson', '2020-05-15', 'female', 'A+', 'No known allergies');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type_status ON users(user_type, approval_status);
CREATE INDEX IF NOT EXISTS idx_advisor_availability_advisor ON advisor_availability(advisor_id);
CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_appointments_parent ON appointments(parent_id);
CREATE INDEX IF NOT EXISTS idx_appointments_advisor ON appointments(advisor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_growth_child_date ON growth_tracking(child_id, measurement_date);
CREATE INDEX IF NOT EXISTS idx_nutrition_child_date ON nutrition_plans(child_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_milestones_child ON milestones(child_id);

-- Grant permissions (if needed)
-- GRANT ALL PRIVILEGES ON smart_mom_db.* TO 'smart_mom_user'@'%';
-- FLUSH PRIVILEGES;