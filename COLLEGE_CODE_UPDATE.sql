-- Add college_code column to institutions table
ALTER TABLE institutions ADD COLUMN college_code VARCHAR(50) UNIQUE;

-- Update existing institutions with default college codes
UPDATE institutions 
SET college_code = CONCAT('COL', LPAD(id::text, 3, '0'))
WHERE college_code IS NULL;

-- Make college_code NOT NULL after updating existing data
ALTER TABLE institutions ALTER COLUMN college_code SET NOT NULL;

-- Add unique constraint to ensure no duplicate college codes
ALTER TABLE institutions ADD CONSTRAINT institutions_college_code_unique UNIQUE (college_code);

-- Update sample data with meaningful college codes
UPDATE institutions 
SET college_code = 'TECH001' 
WHERE name = 'Tech University';

UPDATE institutions 
SET college_code = 'SCI001' 
WHERE name = 'Science College';

-- Verify the changes
SELECT id, name, college_code FROM institutions; 