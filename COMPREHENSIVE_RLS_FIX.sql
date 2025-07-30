-- Comprehensive RLS Fix for Private Libraries
-- Run this script to fix all potential issues

-- 1. Fix private_libraries table RLS policies
DROP POLICY IF EXISTS "Private libraries can view own data" ON private_libraries;
DROP POLICY IF EXISTS "Private libraries can update own data" ON private_libraries;
DROP POLICY IF EXISTS "Allow private library registration" ON private_libraries;
DROP POLICY IF EXISTS "Allow all private library operations" ON private_libraries;

CREATE POLICY "Allow all private library operations" ON private_libraries
  FOR ALL USING (true);

-- 2. Fix books table RLS policies
DROP POLICY IF EXISTS "Allow all operations" ON books;
DROP POLICY IF EXISTS "Allow public read access" ON books;
DROP POLICY IF EXISTS "Allow all books operations" ON books;

CREATE POLICY "Allow all books operations" ON books
  FOR ALL USING (true);

-- 3. Fix categories table RLS policies
DROP POLICY IF EXISTS "Allow all operations" ON categories;
DROP POLICY IF EXISTS "Allow public read access" ON categories;
DROP POLICY IF EXISTS "Allow all categories operations" ON categories;

CREATE POLICY "Allow all categories operations" ON categories
  FOR ALL USING (true);

-- 4. Fix students table RLS policies
DROP POLICY IF EXISTS "Allow all operations" ON students;
DROP POLICY IF EXISTS "Allow public read access" ON students;
DROP POLICY IF EXISTS "Allow all students operations" ON students;

CREATE POLICY "Allow all students operations" ON students
  FOR ALL USING (true);

-- 5. Fix book_issues table RLS policies
DROP POLICY IF EXISTS "Allow all operations" ON book_issues;
DROP POLICY IF EXISTS "Allow public read access" ON book_issues;
DROP POLICY IF EXISTS "Allow all book_issues operations" ON book_issues;

CREATE POLICY "Allow all book_issues operations" ON book_issues
  FOR ALL USING (true);

-- 6. Fix librarians table RLS policies
DROP POLICY IF EXISTS "Allow all operations" ON librarians;
DROP POLICY IF EXISTS "Allow public read access" ON librarians;
DROP POLICY IF EXISTS "Allow all librarians operations" ON librarians;

CREATE POLICY "Allow all librarians operations" ON librarians
  FOR ALL USING (true);

-- 7. Fix notifications table RLS policies
DROP POLICY IF EXISTS "Allow all operations" ON notifications;
DROP POLICY IF EXISTS "Allow public read access" ON notifications;
DROP POLICY IF EXISTS "Allow all notifications operations" ON notifications;

CREATE POLICY "Allow all notifications operations" ON notifications
  FOR ALL USING (true);

-- 8. Fix password_resets table RLS policies
DROP POLICY IF EXISTS "Allow password reset operations" ON password_resets;
DROP POLICY IF EXISTS "Allow all password reset operations" ON password_resets;

CREATE POLICY "Allow all password reset operations" ON password_resets
  FOR ALL USING (true);

-- 9. Check if institutions table has RLS policies (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'institutions') THEN
    DROP POLICY IF EXISTS "Allow all operations" ON institutions;
    DROP POLICY IF EXISTS "Allow public read access" ON institutions;
    DROP POLICY IF EXISTS "Allow all institutions operations" ON institutions;
    
    CREATE POLICY "Allow all institutions operations" ON institutions
      FOR ALL USING (true);
  END IF;
END $$;

-- 10. Verify all policies are created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename IN (
  'private_libraries', 
  'books', 
  'categories', 
  'students', 
  'book_issues', 
  'librarians', 
  'notifications', 
  'password_resets',
  'institutions'
)
ORDER BY tablename, policyname;

-- 11. Check table structure to ensure foreign key constraints are correct
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('books', 'categories', 'students', 'book_issues', 'librarians', 'notifications')
ORDER BY tc.table_name, kcu.column_name; 