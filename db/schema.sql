DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;


CREATE TABLE department (
    dept_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
)AUTO_INCREMENT=1;


CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(dept_id)
    ON DELETE CASCADE
)AUTO_INCREMENT=101;

CREATE TABLE employee (
    emp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES role(role_id)
    ON DELETE CASCADE
)AUTO_INCREMENT=1001;



-- ALTER TABLE employee 
--   ADD CONSTRAINT role_id 
--   FOREIGN KEY (role_id) 
--   REFERENCES role(role_id) 
--   ON DELETE CASCADE;