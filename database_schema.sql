-- Smart Mom System Database Schema
-- Drop database if exists and create new one
DROP DATABASE IF EXISTS smart_mom_db;
CREATE DATABASE smart_mom_db;
USE smart_mom_db;

-- Users Table
CREATE TABLE users (
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
  password_reset_token VARCHAR(255),
  password_reset_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Advisor Availability Table
CREATE TABLE advisor_availability (
  id INT PRIMARY KEY AUTO_INCREMENT,
  advisor_id INT NOT NULL,
  day_of_week ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (advisor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Children Table
CREATE TABLE children (
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

-- Growth Tracking Table
CREATE TABLE growth_tracking (
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
CREATE TABLE nutrition_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  child_id INT NOT NULL,
  plan_date DATE NOT NULL,
  age_group VARCHAR(20),
  goals TEXT,
  breakfast TEXT,
  lunch TEXT,
  dinner TEXT,
  snacks TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Appointments Table
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NOT NULL,
  advisor_id INT NOT NULL,
  child_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  time_slot VARCHAR(20),
  status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id),
  FOREIGN KEY (advisor_id) REFERENCES users(id),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Tips Table
CREATE TABLE tips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('safety', 'health') NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  age_group VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data for testing
INSERT INTO users (email, password, full_name, user_type, age, approval_status) VALUES
('parent@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Johnson', 'parent', 32, 'approved'),
('advisor@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Emily Davis', 'advisor', 38, 'approved');

-- Password for both test users is: password

-- Sample advisor availability
INSERT INTO advisor_availability (advisor_id, day_of_week, start_time, end_time) VALUES
(2, 'monday', '09:00', '12:00'),
(2, 'monday', '14:00', '17:00'),
(2, 'wednesday', '09:00', '12:00'),
(2, 'friday', '09:00', '12:00'),
(2, 'friday', '14:00', '17:00');

-- Sample safety tips
INSERT INTO tips (type, title, category, content, age_group) VALUES
('safety', 'Child-proof Your Home', 'Home Safety', 'Install safety gates, cover electrical outlets, and secure heavy furniture to prevent tip-overs.', 'All Ages'),
('safety', 'Swimming Safety', 'Outdoor Safety', 'Never leave children unattended near water. Enroll children in swimming lessons early.', '3-5 years'),
('safety', 'Road Safety', 'Outdoor Safety', 'Teach children to look both ways before crossing. Always use car seats and seat belts.', 'All Ages'),
('safety', 'Food Choking Prevention', 'Food Safety', 'Cut food into small pieces. Avoid hard, round foods like whole grapes for young children.', '0-2 years'),
('health', 'Vaccination Schedules', 'Vaccination', 'Follow the recommended immunization schedule. Keep vaccination records up to date.', 'All Ages'),
('health', 'Sleep Requirements', 'Sleep & Rest', 'Toddlers need 11-14 hours, school-age children need 9-12 hours of sleep per night.', 'All Ages'),
('health', 'Physical Activity', 'Physical Activity', 'Children need at least 60 minutes of moderate to vigorous activity daily.', '6-12 years'),
('health', 'Dental Care', 'Dental Health', 'Brush teeth twice daily. First dental visit should be at age 1 or when first tooth appears.', '0-2 years');

-- ── Meal Planner: Free & Premium ──────────────────────────────────────────

-- Parent Meal Selections Table
-- Free  : one record per child (overwritten on each generate)
-- Premium: new record per generate; is_active=1 current, is_active=0 archived
CREATE TABLE parent_meal_selections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NOT NULL,
  child_id INT NOT NULL,
  age_group VARCHAR(20) NOT NULL,
  nutrition_goal VARCHAR(200) NOT NULL,        -- comma-separated goals
  plan_version ENUM('free', 'premium') DEFAULT 'free',
  bmi_value DECIMAL(5,2) NULL,
  generated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active TINYINT(1) DEFAULT 1,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- Selected Meal Plan Items Table
-- Free   : week=1, day=1, 3 rows (breakfast/lunch/dinner)
-- Premium: 4 weeks × 7 days × 3 meals = 84 rows per selection
CREATE TABLE selected_meal_plan_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  selection_id INT NOT NULL,
  meal_plan_id TEXT NOT NULL,                  -- meal content string e.g. "Rice + Grilled chicken + Salad"
  week_number INT DEFAULT 1,
  day_number INT DEFAULT 1,
  meal_time ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
  FOREIGN KEY (selection_id) REFERENCES parent_meal_selections(id) ON DELETE CASCADE
);
