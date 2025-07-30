-- Fix Institution ID Column Type for Private Libraries
-- Change institution_id columns from INTEGER to TEXT to accept both UUID and integer values

-- 1. First, let's check the current column types
SELECT 
  table_name, 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE column_name = 'institution_id' 
  AND table_name IN ('books', 'categories', 'students', 'book_issues', 'librarians', 'notifications')
ORDER BY table_name;

-- 2. Change institution_id columns from INTEGER to TEXT
-- This allows both UUID and integer values

-- Books table
ALTER TABLE books ALTER COLUMN institution_id TYPE TEXT;

-- Categories table  
ALTER TABLE categories ALTER COLUMN institution_id TYPE TEXT;

-- Students table
ALTER TABLE students ALTER COLUMN institution_id TYPE TEXT;

-- Book issues table
ALTER TABLE book_issues ALTER COLUMN institution_id TYPE TEXT;

-- Librarians table
ALTER TABLE librarians ALTER COLUMN institution_id TYPE TEXT;

-- Notifications table
ALTER TABLE notifications ALTER COLUMN institution_id TYPE TEXT;

-- 3. Verify the changes
SELECT 
  table_name, 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE column_name = 'institution_id' 
  AND table_name IN ('books', 'categories', 'students', 'book_issues', 'librarians', 'notifications')
ORDER BY table_name;

-- 4. Test inserting with both UUID and integer values
-- Test with integer (existing institution)
INSERT INTO categories (name, description, institution_id) 
VALUES ('Test Category Integer', 'Test Description', '1') 
RETURNING *;

-- Test with UUID (private library)
INSERT INTO categories (name, description, institution_id) 
VALUES ('Test Category UUID', 'Test Description', '722b9df3-bff1-48bf-9337-eb9751021402') 
RETURNING *;

-- 5. Clean up test data
DELETE FROM categories WHERE name LIKE 'Test Category%';

-- 6. Success message
SELECT 'Institution ID columns changed to TEXT. Private libraries should now work!' as status; 