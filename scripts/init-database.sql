-- Create tables based on Prisma schema
-- This script initializes the database with sample data

-- Note: Prisma will handle table creation, this is for reference and seeding

-- Sample Students
INSERT INTO Student (
  id, firstName, surname, dateOfBirth, class, status, bloodType,
  nationality, gender, academicYear, registrationNo
) VALUES 
  ('student1', 'John', 'Doe', '2010-05-15', 'Year_3', 'ACTIVE', 'O_POSITIVE', 'Tanzanian', 'male', '2024-2025', 'STU001'),
  ('student2', 'Jane', 'Smith', '2011-08-22', 'Year_2', 'ACTIVE', 'A_POSITIVE', 'Kenyan', 'female', '2024-2025', 'STU002'),
  ('student3', 'Michael', 'Johnson', '2009-12-10', 'Year_4', 'ACTIVE', 'B_POSITIVE', 'Ugandan', 'male', '  'Michael', 'Johnson', '2009-12-10', 'Year_4', 'ACTIVE', 'B_POSITIVE', 'Ugandan', 'male', '2024-2025', 'STU003');

-- Sample Staff
INSERT INTO Staff (
  id, firstName, surname, dateOfBirth, designation, staffType,
  nationality, gender, dateOfEmployment
) VALUES 
  ('staff1', 'Sarah', 'Wilson', '1985-03-20', 'Mathematics Teacher', 'resident_teaching_staff', 'Tanzanian', 'female', '2020-01-15'),
  ('staff2', 'David', 'Brown', '1978-11-05', 'Principal', 'resident_teaching_staff', 'British', 'male', '2018-08-01'),
  ('staff3', 'Mary', 'Davis', '1990-07-12', 'Science Teacher', 'international_teaching_staff', 'American', 'female', '2022-09-01');

-- Sample Guardians
INSERT INTO Guardian (
  id, studentId, relationship, fullName, occupation, contactPhone, emailAddress
) VALUES 
  ('guard1', 'student1', 'father', 'Robert Doe', 'Engineer', '+255123456789', 'robert.doe@email.com'),
  ('guard2', 'student1', 'mother', 'Alice Doe', 'Teacher', '+255987654321', 'alice.doe@email.com'),
  ('guard3', 'student2', 'mother', 'Susan Smith', 'Doctor', '+254123456789', 'susan.smith@email.com');

-- Sample Emergency Contacts
INSERT INTO EmergencyContact (
  id, studentId, fullNames, relationship, contactPhone
) VALUES 
  ('emerg1', 'student1', 'James Doe', 'Uncle', '+255111222333'),
  ('emerg2', 'student2', 'Peter Smith', 'Grandfather', '+254444555666'),
  ('emerg3', 'student3', 'Grace Johnson', 'Aunt', '+256777888999');
