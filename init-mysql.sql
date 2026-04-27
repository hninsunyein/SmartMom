-- Initialize MySQL with proper user permissions for local development

-- Update root user for external connections
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'smartmom123';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'smartmom123';

-- Create smart_mom_user with all connection types
CREATE USER IF NOT EXISTS 'smart_mom_user'@'%' IDENTIFIED WITH mysql_native_password BY 'smartmom456';
CREATE USER IF NOT EXISTS 'smart_mom_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'smartmom456';
CREATE USER IF NOT EXISTS 'smart_mom_user'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'smartmom456';
CREATE USER IF NOT EXISTS 'smart_mom_user'@'::1' IDENTIFIED WITH mysql_native_password BY 'smartmom456';

-- Grant privileges
GRANT ALL PRIVILEGES ON smart_mom_db.* TO 'smart_mom_user'@'%';
GRANT ALL PRIVILEGES ON smart_mom_db.* TO 'smart_mom_user'@'localhost';
GRANT ALL PRIVILEGES ON smart_mom_db.* TO 'smart_mom_user'@'127.0.0.1';
GRANT ALL PRIVILEGES ON smart_mom_db.* TO 'smart_mom_user'@'::1';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
