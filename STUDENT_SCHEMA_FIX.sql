-- Fix students table schema to match application requirements

-- First, let's check the current structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add 'branch' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'branch') THEN
        ALTER TABLE students ADD COLUMN branch VARCHAR(100);
    END IF;
    
    -- Add 'section' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'section') THEN
        ALTER TABLE students ADD COLUMN section VARCHAR(10) DEFAULT 'A';
    END IF;
    
    -- Add 'class' column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'class') THEN
        ALTER TABLE students ADD COLUMN class VARCHAR(100);
    END IF;
    
    -- Rename 'college_name' to 'college' if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'students' AND column_name = 'college_name') THEN
        ALTER TABLE students RENAME COLUMN college_name TO college;
    END IF;
    
    -- Rename 'college_branch' to 'college_branch' (keep as is for database, but ensure it exists)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'college_branch') THEN
        ALTER TABLE students ADD COLUMN college_branch VARCHAR(100);
    END IF;
    
END $$;

-- Update existing data to populate new columns
UPDATE students 
SET 
    branch = college_branch,
    class = course,
    section = 'A'
WHERE branch IS NULL OR class IS NULL OR section IS NULL;

-- Make sure required columns are NOT NULL
ALTER TABLE students ALTER COLUMN branch SET NOT NULL;
ALTER TABLE students ALTER COLUMN class SET NOT NULL;
ALTER TABLE students ALTER COLUMN section SET NOT NULL;

-- Verify the final structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;

-- Show sample data to verify
SELECT id, name, student_id, course, branch, college_branch, class, section, college 
FROM students LIMIT 5; 