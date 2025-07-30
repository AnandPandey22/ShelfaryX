-- Simple Foreign Key Fix for Private Libraries
-- This script simply removes the restrictive foreign key constraints
-- and lets the application handle validation

-- 1. Drop all foreign key constraints that reference institutions table
-- This allows private libraries to use their own IDs as institution_id

-- Drop books table foreign key
ALTER TABLE books DROP CONSTRAINT IF EXISTS books_institution_id_fkey;

-- Drop categories table foreign key  
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_institution_id_fkey;

-- Drop students table foreign key
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_institution_id_fkey;

-- Drop book_issues table foreign key
ALTER TABLE book_issues DROP CONSTRAINT IF EXISTS book_issues_institution_id_fkey;

-- Drop librarians table foreign key
ALTER TABLE librarians DROP CONSTRAINT IF EXISTS librarians_institution_id_fkey;

-- Drop notifications table foreign key
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_institution_id_fkey;

-- 2. Drop any existing check constraints that might be causing issues
ALTER TABLE books DROP CONSTRAINT IF EXISTS books_institution_id_check;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_institution_id_check;
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_institution_id_check;
ALTER TABLE book_issues DROP CONSTRAINT IF EXISTS book_issues_institution_id_check;
ALTER TABLE librarians DROP CONSTRAINT IF EXISTS librarians_institution_id_check;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_institution_id_check;

-- 3. Drop any existing triggers that might be causing issues
DROP TRIGGER IF EXISTS validate_books_institution_id ON books;
DROP TRIGGER IF EXISTS validate_categories_institution_id ON categories;
DROP TRIGGER IF EXISTS validate_students_institution_id ON students;
DROP TRIGGER IF EXISTS validate_book_issues_institution_id ON book_issues;
DROP TRIGGER IF EXISTS validate_librarians_institution_id ON librarians;
DROP TRIGGER IF EXISTS validate_notifications_institution_id ON notifications;

-- 4. Drop any existing functions that might be causing issues
DROP FUNCTION IF EXISTS check_institution_exists(TEXT);
DROP FUNCTION IF EXISTS check_institution_exists(INTEGER);
DROP FUNCTION IF EXISTS check_institution_exists(UUID);
DROP FUNCTION IF EXISTS validate_institution_id();

-- 5. Verify the changes
SELECT 
  tc.table_name, 
  kcu.column_name, 
  tc.constraint_type,
  tc.constraint_name
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_name IN ('books', 'categories', 'students', 'book_issues', 'librarians', 'notifications')
  AND kcu.column_name = 'institution_id'
ORDER BY tc.table_name, kcu.column_name;

-- 6. Verify no triggers exist
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('books', 'categories', 'students', 'book_issues', 'librarians', 'notifications')
  AND trigger_name LIKE '%institution_id%';

-- 7. Success message
SELECT 'Foreign key constraints removed successfully! Private libraries should now be able to add data.' as status; 