# Database Setup for Development Supabase Project

## Project Details
- **URL**: https://glhwrkvcfrbyjocrigyo.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaHdya3ZjZnJieWpvY3JpZ3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjE5NTQsImV4cCI6MjA2OTI5Nzk1NH0.QQndoBJIGY4dS_18SmMaCkxfhrCDsAO9uaReUNUTCfU

## Step 1: Create Tables

### 1. Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  book_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Books Table
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  total_copies INTEGER NOT NULL DEFAULT 1,
  available_copies INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  class VARCHAR(50) NOT NULL,
  college_branch VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Librarians Table
```sql
CREATE TABLE librarians (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Book Issues Table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 2: Insert Sample Data

### Insert Categories
```sql
INSERT INTO categories (name) VALUES
('Fiction'),
('Non-Fiction'),
('Science'),
('Technology'),
('History'),
('Literature'),
('Mathematics'),
('Computer Science');
```

### Insert Books
```sql
INSERT INTO books (title, author, isbn, category_id, total_copies, available_copies) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 1, 3, 3),
('To Kill a Mockingbird', 'Harper Lee', '978-0446310789', 1, 2, 2),
('1984', 'George Orwell', '978-0451524935', 1, 4, 4),
('Pride and Prejudice', 'Jane Austen', '978-0141439518', 1, 2, 2),
('The Hobbit', 'J.R.R. Tolkien', '978-0547928241', 1, 3, 3),
('Sapiens', 'Yuval Noah Harari', '978-0062316097', 2, 2, 2),
('The Art of War', 'Sun Tzu', '978-0140439199', 2, 1, 1),
('A Brief History of Time', 'Stephen Hawking', '978-0553380163', 3, 2, 2),
('The Selfish Gene', 'Richard Dawkins', '978-0192860927', 3, 1, 1),
('Clean Code', 'Robert C. Martin', '978-0132350884', 4, 3, 3),
('Design Patterns', 'Erich Gamma', '978-0201633610', 4, 2, 2),
('The Pragmatic Programmer', 'Andrew Hunt', '978-0201616224', 4, 2, 2),
('JavaScript: The Good Parts', 'Douglas Crockford', '978-0596517748', 8, 2, 2),
('React: Up & Running', 'Stoyan Stefanov', '978-1491931820', 8, 1, 1),
('Node.js Design Patterns', 'Mario Casciaro', '978-1785885587', 8, 1, 1),
('The World Wars', 'John Keegan', '978-0679643757', 5, 2, 2),
('Rome: A History', 'Robert Hughes', '978-0679721837', 5, 1, 1),
('Shakespeare: The World as Stage', 'Bill Bryson', '978-0061673696', 6, 2, 2),
('Calculus: Early Transcendentals', 'James Stewart', '978-1285741550', 7, 3, 3),
('Linear Algebra', 'Gilbert Strang', '978-0980232714', 7, 2, 2);
```

### Insert Students
```sql
INSERT INTO students (name, student_id, class, college_branch, contact) VALUES
('John Smith', 'STU001', '3rd Year', 'Computer Science', '9876543210'),
('Emma Wilson', 'STU002', '2nd Year', 'Electrical Engineering', '9876543211'),
('Michael Brown', 'STU003', '4th Year', 'Mechanical Engineering', '9876543212'),
('Sarah Davis', 'STU004', '1st Year', 'Computer Science', '9876543213'),
('David Miller', 'STU005', '3rd Year', 'Civil Engineering', '9876543214'),
('Lisa Johnson', 'STU006', '2nd Year', 'Computer Science', '9876543215'),
('Robert Wilson', 'STU007', '4th Year', 'Electrical Engineering', '9876543216'),
('Jennifer Taylor', 'STU008', '1st Year', 'Mechanical Engineering', '9876543217'),
('Christopher Anderson', 'STU009', '3rd Year', 'Computer Science', '9876543218'),
('Amanda Thomas', 'STU010', '2nd Year', 'Civil Engineering', '9876543219'),
('Daniel Jackson', 'STU011', '4th Year', 'Computer Science', '9876543220'),
('Nicole White', 'STU012', '1st Year', 'Electrical Engineering', '9876543221'),
('Kevin Martin', 'STU013', '3rd Year', 'Mechanical Engineering', '9876543222'),
('Rachel Garcia', 'STU014', '2nd Year', 'Computer Science', '9876543223'),
('Steven Rodriguez', 'STU015', '4th Year', 'Civil Engineering', '9876543224');
```

### Insert Librarian
```sql
INSERT INTO librarians (email, password, name) VALUES
('admin@gmail.com', 'admin123', 'Library Administrator');
```

### Insert Sample Book Issues
```sql
INSERT INTO book_issues (book_id, student_id, issue_date, due_date, return_date, fine, status) VALUES
(1, 1, '2024-01-15', '2024-01-29', '2024-01-28', 0, 'returned'),
(3, 2, '2024-01-20', '2024-02-03', '2024-02-02', 0, 'returned'),
(5, 3, '2024-01-25', '2024-02-08', NULL, 0, 'issued'),
(7, 4, '2024-01-10', '2024-01-24', '2024-01-30', 1000, 'returned'),
(10, 5, '2024-01-30', '2024-02-13', NULL, 0, 'issued'),
(12, 6, '2024-01-05', '2024-01-19', '2024-01-18', 0, 'returned'),
(15, 7, '2024-01-12', '2024-01-26', '2024-01-25', 0, 'returned'),
(18, 8, '2024-01-18', '2024-02-01', NULL, 0, 'issued'),
(20, 9, '2024-01-22', '2024-02-05', '2024-02-04', 0, 'returned'),
(2, 10, '2024-01-08', '2024-01-22', '2024-01-25', 1000, 'returned');
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
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE librarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_issues ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed)
CREATE POLICY "Allow all operations" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON books FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON librarians FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON book_issues FOR ALL USING (true);
```

## Login Credentials
- **Email**: admin@gmail.com
- **Password**: admin123

## Notes
- All dates are in YYYY-MM-DD format
- Fines are in rupees (₹)
- Book issues include both current and returned books
- Some books are overdue to test the overdue functionality 