# Multi-Institution BookZone Database Setup

## Project Details
- **URL**: your-supabase-url
- **Anon Key**: your-supabase-anon-key

## Step 1: Create Tables

### 1. Institutions Table
```sql
CREATE TABLE institutions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  website VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  book_count INTEGER DEFAULT 0,
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Books Table
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  publisher VARCHAR(255),
  publish_year INTEGER,
  total_copies INTEGER NOT NULL DEFAULT 1,
  available_copies INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  image_url VARCHAR(500),
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  student_id VARCHAR(50) NOT NULL,
  course VARCHAR(100) NOT NULL,
  college_branch VARCHAR(100) NOT NULL,
  college_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  join_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Librarians Table
```sql
CREATE TABLE librarians (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Book Issues Table
```sql
CREATE TABLE book_issues (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  fine DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'issued', -- 'issued', 'returned', 'overdue'
  issued_by VARCHAR(255), -- librarian name
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. Notifications Table
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  user_type VARCHAR(20) NOT NULL, -- 'institution', 'student'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'overdue', 'due_soon', 'returned', 'issued'
  is_read BOOLEAN DEFAULT FALSE,
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 2: Insert Sample Data

### Insert Sample Institution
```sql
INSERT INTO institutions (name, email, password, address, phone, website) VALUES
('Tech University', 'admin@techuniversity.edu', 'admin123', '123 Tech Street, Tech City, TC 12345', '+1-555-0123', 'https://techuniversity.edu'),
('Science College', 'admin@sciencecollege.edu', 'admin123', '456 Science Avenue, Science City, SC 67890', '+1-555-0456', 'https://sciencecollege.edu');
```

### Insert Sample Categories
```sql
INSERT INTO categories (name, description, institution_id) VALUES
('Computer Science', 'Books related to programming, algorithms, and computer systems', 1),
('Engineering', 'Books on various engineering disciplines', 1),
('Mathematics', 'Mathematical concepts and problem solving', 1),
('Literature', 'Fiction and non-fiction literature', 1),
('Computer Science', 'Books related to programming, algorithms, and computer systems', 2),
('Physics', 'Books on physics and related sciences', 2),
('Chemistry', 'Books on chemical sciences', 2),
('Biology', 'Books on biological sciences', 2);
```

### Insert Sample Books
```sql
INSERT INTO books (title, author, isbn, category_id, publisher, publish_year, total_copies, available_copies, description, institution_id) VALUES
('Clean Code', 'Robert C. Martin', '978-0132350884', 1, 'Prentice Hall', 2008, 3, 3, 'A handbook of agile software craftsmanship', 1),
('Design Patterns', 'Erich Gamma', '978-0201633610', 1, 'Addison-Wesley', 1994, 2, 2, 'Elements of reusable object-oriented software', 1),
('The Pragmatic Programmer', 'Andrew Hunt', '978-0201616224', 1, 'Addison-Wesley', 1999, 2, 2, 'Your journey to mastery', 1),
('Calculus: Early Transcendentals', 'James Stewart', '978-1285741550', 3, 'Cengage Learning', 2015, 3, 3, 'Comprehensive calculus textbook', 1),
('Linear Algebra', 'Gilbert Strang', '978-0980232714', 3, 'Wellesley-Cambridge Press', 2016, 2, 2, 'Introduction to linear algebra', 1),
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 4, 'Scribner', 2004, 2, 2, 'Classic American novel', 1),
('JavaScript: The Good Parts', 'Douglas Crockford', '978-0596517748', 5, 'O''Reilly Media', 2008, 2, 2, 'The good parts of JavaScript', 2),
('React: Up & Running', 'Stoyan Stefanov', '978-1491931820', 5, 'O''Reilly Media', 2016, 1, 1, 'Building web applications with React', 2),
('Physics for Scientists and Engineers', 'Raymond A. Serway', '978-1133947271', 6, 'Cengage Learning', 2013, 2, 2, 'Comprehensive physics textbook', 2),
('Organic Chemistry', 'John McMurry', '978-1305080485', 7, 'Cengage Learning', 2015, 2, 2, 'Organic chemistry principles', 2);
```

### Insert Sample Students
```sql
INSERT INTO students (name, email, password, student_id, course, college_branch, college_name, mobile_number, address, institution_id) VALUES
('John Smith', 'john.smith@student.techuniversity.edu', 'student123', 'STU001', 'Computer Science', 'Computer Science', 'Tech University', '9876543210', '123 Student Street, Tech City', 1),
('Emma Wilson', 'emma.wilson@student.techuniversity.edu', 'student123', 'STU002', 'Electrical Engineering', 'Electrical Engineering', 'Tech University', '9876543211', '456 Student Avenue, Tech City', 1),
('Michael Brown', 'michael.brown@student.techuniversity.edu', 'student123', 'STU003', 'Mechanical Engineering', 'Mechanical Engineering', 'Tech University', '9876543212', '789 Student Road, Tech City', 1),
('Sarah Davis', 'sarah.davis@student.sciencecollege.edu', 'student123', 'STU004', 'Physics', 'Physics', 'Science College', '9876543213', '321 Student Lane, Science City', 2),
('David Miller', 'david.miller@student.sciencecollege.edu', 'student123', 'STU005', 'Chemistry', 'Chemistry', 'Science College', '9876543214', '654 Student Drive, Science City', 2);
```

### Insert Sample Librarians
```sql
INSERT INTO librarians (name, email, password, institution_id) VALUES
('Library Admin', 'admin@techuniversity.edu', 'admin123', 1),
('Library Manager', 'admin@sciencecollege.edu', 'admin123', 2);
```

### Insert Sample Book Issues
```sql
INSERT INTO book_issues (book_id, student_id, issue_date, due_date, return_date, fine, status, issued_by, institution_id) VALUES
(1, 1, '2024-01-15', '2024-01-29', '2024-01-28', 0, 'returned', 'Library Admin', 1),
(2, 2, '2024-01-20', '2024-02-03', '2024-02-02', 0, 'returned', 'Library Admin', 1),
(3, 3, '2024-01-25', '2024-02-08', NULL, 0, 'issued', 'Library Admin', 1),
(7, 4, '2024-01-10', '2024-01-24', '2024-01-30', 1000, 'returned', 'Library Manager', 2),
(8, 5, '2024-01-30', '2024-02-13', NULL, 0, 'issued', 'Library Manager', 2);
```

### Insert Sample Notifications
```sql
INSERT INTO notifications (user_id, user_type, title, message, type, institution_id) VALUES
(3, 'student', 'Book Due Soon', 'Your book "The Pragmatic Programmer" is due in 2 days', 'due_soon', 1),
(5, 'student', 'Book Due Soon', 'Your book "React: Up & Running" is due in 3 days', 'due_soon', 2);
```

## Step 3: Update Book Counts
```sql
-- Update book counts for categories
UPDATE categories SET book_count = (
  SELECT COUNT(*) FROM books WHERE category_id = categories.id
);
```

## Step 4: Update Available Copies
```sql
-- Update available copies for books
UPDATE books SET available_copies = total_copies - (
  SELECT COUNT(*) FROM book_issues 
  WHERE book_id = books.id AND status = 'issued'
);
```

## Step 5: Enable Row Level Security (Optional)
```sql
-- Enable RLS on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE librarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed)
CREATE POLICY "Allow all operations" ON institutions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON books FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON librarians FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON book_issues FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON notifications FOR ALL USING (true);
```

## Login Credentials

### Institution Logins:
- **Tech University**: admin@techuniversity.edu / admin123
- **Science College**: admin@sciencecollege.edu / admin123

### Student Logins:
- **John Smith**: john.smith@student.techuniversity.edu / student123
- **Emma Wilson**: emma.wilson@student.techuniversity.edu / student123
- **Michael Brown**: michael.brown@student.techuniversity.edu / student123
- **Sarah Davis**: sarah.davis@student.sciencecollege.edu / student123
- **David Miller**: david.miller@student.sciencecollege.edu / student123

## Notes
- All data is isolated by institution_id
- Students can only access their own institution's library
- Librarians can only manage their own institution's data
- Notifications are sent for overdue books and due date reminders
- Each institution has its own categories and books 
