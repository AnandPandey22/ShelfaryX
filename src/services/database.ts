import { supabase, TABLES } from '../lib/supabase';
import { Book, BookCategory, Student, BookIssue, Librarian, Institution, PrivateLibrary, Notification } from '../types';

// Helper functions for data transformation
const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      newObj[snakeKey] = toSnakeCase(obj[key]);
    });
    return newObj;
  }
  return obj;
};

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      newObj[camelKey] = toCamelCase(obj[key]);
    });
    return newObj;
  }
  return obj;
};

// Helper function to generate unique library code
const generateLibraryCode = (): string => {
  const prefix = 'LIB';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Institution Operations
export const institutionService = {
  // Get all institutions
  async getAllInstitutions(): Promise<Institution[]> {
    const { data, error } = await supabase
      .from(TABLES.INSTITUTIONS)
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Get institution by ID
  async getInstitutionById(id: string): Promise<Institution | null> {
    const { data, error } = await supabase
      .from(TABLES.INSTITUTIONS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return toCamelCase(data);
  },

  // Register new institution
  async registerInstitution(institution: Omit<Institution, 'id' | 'createdAt'>): Promise<Institution> {
    const snakeInstitution = toSnakeCase(institution);
    const { data, error } = await supabase
      .from(TABLES.INSTITUTIONS)
      .insert([snakeInstitution])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Authenticate institution
  async authenticateInstitution(email: string, password: string): Promise<Institution | null> {
    const { data, error } = await supabase
      .from(TABLES.INSTITUTIONS)
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('is_active', true)
      .single();
    
    if (error) return null;
    return toCamelCase(data);
  }
};

// Private Library Operations
export const privateLibraryService = {
  // Get all private libraries
  async getAllPrivateLibraries(): Promise<PrivateLibrary[]> {
    const { data, error } = await supabase
      .from(TABLES.PRIVATE_LIBRARIES)
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Get private library by ID
  async getPrivateLibraryById(id: string): Promise<PrivateLibrary | null> {
    const { data, error } = await supabase
      .from(TABLES.PRIVATE_LIBRARIES)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return toCamelCase(data);
  },

  // Register new private library
  async registerPrivateLibrary(library: Omit<PrivateLibrary, 'id' | 'createdAt' | 'libraryCode'>): Promise<PrivateLibrary> {
    // Generate unique library code
    let libraryCode = generateLibraryCode();
    let isUnique = false;
    
    while (!isUnique) {
      const { data: existing } = await supabase
        .from(TABLES.PRIVATE_LIBRARIES)
        .select('id')
        .eq('library_code', libraryCode)
        .single();
      
      if (!existing) {
        isUnique = true;
      } else {
        libraryCode = generateLibraryCode();
      }
    }

    const snakeLibrary = toSnakeCase({ ...library, libraryCode });
    const { data, error } = await supabase
      .from(TABLES.PRIVATE_LIBRARIES)
      .insert([snakeLibrary])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Authenticate private library
  async authenticatePrivateLibrary(email: string, password: string): Promise<PrivateLibrary | null> {
    const { data, error } = await supabase
      .from(TABLES.PRIVATE_LIBRARIES)
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('is_active', true)
      .single();
    
    if (error) return null;
    return toCamelCase(data);
  }
};

// Book Operations (with institution filtering)
export const bookService = {
  // Get all books for an institution
  async getAllBooks(institutionId: string): Promise<Book[]> {
    const { data, error } = await supabase
      .from(TABLES.BOOKS)
      .select(`
        *,
        categories(name)
      `)
      .eq('institution_id', institutionId)
      .order('title');
    
    if (error) throw error;
    
    // Transform data and map category name
    const transformedData = toCamelCase(data || []);
    return transformedData.map((book: any) => ({
      ...book,
      category: book.categories?.name || null
    }));
  },

  // Get book by ID
  async getBookById(id: string): Promise<Book | null> {
    const { data, error } = await supabase
      .from(TABLES.BOOKS)
      .select(`
        *,
        categories(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) return null;
    
    // Transform data and map category name
    const transformedData = toCamelCase(data);
    return {
      ...transformedData,
      category: transformedData.categories?.name || null
    };
  },

  // Add book
  async addBook(book: Omit<Book, 'id'>, institutionId: string): Promise<Book> {
    const snakeBook = toSnakeCase({ ...book, institutionId });
    const { data, error } = await supabase
      .from(TABLES.BOOKS)
      .insert([snakeBook])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Update book
  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await supabase
      .from(TABLES.BOOKS)
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Delete book
  async deleteBook(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.BOOKS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Search books
  async searchBooks(query: string, institutionId: string): Promise<Book[]> {
    const { data, error } = await supabase
      .from(TABLES.BOOKS)
      .select(`
        *,
        categories(name)
      `)
      .eq('institution_id', institutionId)
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`)
      .order('title');
    
    if (error) throw error;
    
    // Transform data and map category name
    const transformedData = toCamelCase(data || []);
    return transformedData.map((book: any) => ({
      ...book,
      category: book.categories?.name || null
    }));
  }
};

// Category Operations (with institution filtering)
export const categoryService = {
  // Get all categories for an institution
  async getAllCategories(institutionId: string): Promise<BookCategory[]> {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .eq('institution_id', institutionId)
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Add category
  async addCategory(category: Omit<BookCategory, 'id' | 'bookCount'>, institutionId: string): Promise<BookCategory> {
    const snakeCategory = toSnakeCase({ ...category, institutionId });
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .insert([snakeCategory])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Update category
  async updateCategory(id: string, updates: Partial<BookCategory>): Promise<BookCategory> {
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.CATEGORIES)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Update book count
  async updateBookCount(categoryId: string): Promise<void> {
    const { data: books } = await supabase
      .from(TABLES.BOOKS)
      .select('id')
      .eq('category_id', categoryId);
    
    const bookCount = books?.length || 0;
    
    const { error } = await supabase
      .from(TABLES.CATEGORIES)
      .update({ book_count: bookCount })
      .eq('id', categoryId);
    
    if (error) throw error;
  }
};

// Student Operations (with institution filtering)
export const studentService = {
  // Get all students for an institution
  async getAllStudents(institutionId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select('*')
      .eq('institution_id', institutionId)
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Add student
  async addStudent(student: Omit<Student, 'id'>, institutionId: string): Promise<Student> {
    const snakeStudent = toSnakeCase({ ...student, institutionId });
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .insert([snakeStudent])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Update student
  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Delete student
  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.STUDENTS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Search students
  async searchStudents(query: string, institutionId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select('*')
      .eq('institution_id', institutionId)
      .or(`name.ilike.%${query}%,student_id.ilike.%${query}%,course.ilike.%${query}%,college_branch.ilike.%${query}%`)
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Authenticate student
  async authenticateStudent(email: string, password: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('is_active', true)
      .single();
    
    if (error) return null;
    return toCamelCase(data);
  }
};

// Issue Operations (with institution filtering)
export const issueService = {
  // Get all issues for an institution
  async getAllIssues(institutionId: string): Promise<BookIssue[]> {
    const { data, error } = await supabase
      .from(TABLES.ISSUES)
      .select(`
        *,
        books(title, author),
        students(name, student_id)
      `)
      .eq('institution_id', institutionId)
      .order('issue_date', { ascending: false });
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Get issues for a specific student
  async getStudentIssues(studentId: string): Promise<BookIssue[]> {
    const { data, error } = await supabase
      .from(TABLES.ISSUES)
      .select(`
        *,
        books(title, author)
      `)
      .eq('student_id', studentId)
      .order('issue_date', { ascending: false });
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Issue a book
  async issueBook(issue: Omit<BookIssue, 'id'>, institutionId: string): Promise<BookIssue> {
    const snakeIssue = toSnakeCase({ ...issue, institutionId });
    const { data, error } = await supabase
      .from(TABLES.ISSUES)
      .insert([snakeIssue])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Return a book
  async returnBook(issueId: string, fine: number = 0): Promise<void> {
    const { error } = await supabase
      .from(TABLES.ISSUES)
      .update({ 
        status: 'returned',
        return_date: new Date().toISOString(),
        fine: fine
      })
      .eq('id', issueId);
    
    if (error) throw error;
  },

  // Update issue status
  async updateIssueStatus(issueId: string, status: 'issued' | 'returned' | 'overdue'): Promise<void> {
    const { error } = await supabase
      .from(TABLES.ISSUES)
      .update({ status })
      .eq('id', issueId);
    
    if (error) throw error;
  },

  // Get overdue books for an institution
  async getOverdueBooks(institutionId: string): Promise<BookIssue[]> {
    const today = new Date().toLocaleDateString('en-CA'); // Use local date
    const { data, error } = await supabase
      .from(TABLES.ISSUES)
      .select(`
        *,
        books(title, author),
        students(name, student_id)
      `)
      .eq('institution_id', institutionId)
      .eq('status', 'issued')
      .lte('due_date', today) // Changed from .lt to .lte to include today
      .order('due_date');
    
    if (error) throw error;
    return toCamelCase(data || []);
  }
};

// Librarian Operations (with institution filtering)
export const librarianService = {
  // Authenticate librarian
  async authenticate(email: string, password: string): Promise<Librarian | null> {
    const { data, error } = await supabase
      .from(TABLES.LIBRARIANS)
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('is_active', true)
      .single();
    
    if (error) return null;
    return toCamelCase(data);
  },

  // Get librarian by ID
  async getLibrarianById(id: string): Promise<Librarian | null> {
    const { data, error } = await supabase
      .from(TABLES.LIBRARIANS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return toCamelCase(data);
  }
};

// Notification Operations
export const notificationService = {
  // Get notifications for a user
  async getUserNotifications(userId: string, userType: 'institution' | 'student', institutionId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .select('*')
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Create notification
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const snakeNotification = toSnakeCase(notification);
    const { data, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .insert([snakeNotification])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  },

  // Create overdue notification
  async createOverdueNotification(studentId: string, bookTitle: string, institutionId: string): Promise<void> {
    await this.createNotification({
      userId: studentId,
      userType: 'student',
      title: 'Book Overdue',
      message: `Your book "${bookTitle}" is overdue. Please return it immediately to avoid fines.`,
      type: 'overdue',
      isRead: false,
      institutionId
    });
  },

  // Create due soon notification
  async createDueSoonNotification(studentId: string, bookTitle: string, daysLeft: number, institutionId: string): Promise<void> {
    await this.createNotification({
      userId: studentId,
      userType: 'student',
      title: 'Book Due Soon',
      message: `Your book "${bookTitle}" is due in ${daysLeft} days. Please return it on time.`,
      type: 'due_soon',
      isRead: false,
      institutionId
    });
  }
}; 

// Admin Operations
export const adminService = {
  // Get all institutions for admin
  async getAllInstitutionsForAdmin(): Promise<Institution[]> {
    const { data, error } = await supabase
      .from(TABLES.INSTITUTIONS)
      .select('*')
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Get all private libraries for admin
  async getAllPrivateLibrariesForAdmin(): Promise<PrivateLibrary[]> {
    const { data, error } = await supabase
      .from(TABLES.PRIVATE_LIBRARIES)
      .select('*')
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Get all students across all institutions
  async getAllStudentsForAdmin(): Promise<Student[]> {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select(`
        *,
        institutions(name)
      `)
      .order('name');
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Get all books across all institutions
  async getAllBooksForAdmin(): Promise<Book[]> {
    const { data, error } = await supabase
      .from(TABLES.BOOKS)
      .select(`
        *,
        categories(name),
        institutions(name)
      `)
      .order('title');
    
    if (error) throw error;
    
    // Transform data and map category name
    const transformedData = toCamelCase(data || []);
    return transformedData.map((book: any) => ({
      ...book,
      category: book.categories?.name || null
    }));
  },

  // Get all issues across all institutions
  async getAllIssuesForAdmin(): Promise<BookIssue[]> {
    const { data, error } = await supabase
      .from(TABLES.ISSUES)
      .select(`
        *,
        books(title, author),
        students(name, student_id),
        institutions(name)
      `)
      .order('issue_date', { ascending: false });
    
    if (error) throw error;
    return toCamelCase(data || []);
  },

  // Get admin statistics
  async getAdminStatistics() {
    const [institutions, privateLibraries, students, books, issues] = await Promise.all([
      this.getAllInstitutionsForAdmin(),
      this.getAllPrivateLibrariesForAdmin(),
      this.getAllStudentsForAdmin(),
      this.getAllBooksForAdmin(),
      this.getAllIssuesForAdmin()
    ]);

    const totalInstitutions = institutions.length;
    const totalPrivateLibraries = privateLibraries.length;
    const totalStudents = students.length;
    const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
    const totalIssuedBooks = issues.filter(issue => issue.status === 'issued' || issue.status === 'overdue').length;
    const totalReturnedBooks = issues.filter(issue => issue.status === 'returned').length;
    const totalOverdueBooks = issues.filter(issue => issue.status === 'overdue').length;

    return {
      totalInstitutions,
      totalPrivateLibraries,
      totalStudents,
      totalBooks,
      totalIssuedBooks,
      totalReturnedBooks,
      totalOverdueBooks,
      institutions,
      privateLibraries,
      students,
      books,
      issues
    };
  },

  // Authenticate admin
  async authenticateAdmin(email: string, password: string): Promise<{ isAdmin: boolean } | null> {
    // Hardcoded admin credentials
    if (email === 'bookzonelibrary@outlook.com' && password === 'Arthur$53') {
      return { isAdmin: true };
    }
    return null;
  },

  // Admin: Update institution
  async updateInstitution(id: string, updates: Partial<Institution>): Promise<Institution> {
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await supabase
      .from(TABLES.INSTITUTIONS)
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Admin: Add new institution
  async addInstitution(institution: Omit<Institution, 'id' | 'createdAt'>): Promise<Institution> {
    const snakeInstitution = toSnakeCase(institution);
    const { data, error } = await supabase
      .from(TABLES.INSTITUTIONS)
      .insert([snakeInstitution])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Admin: Update student
  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const snakeUpdates = toSnakeCase(updates);
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .update(snakeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  },

  // Admin: Add new student
  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const snakeStudent = toSnakeCase(student);
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .insert([snakeStudent])
      .select()
      .single();
    
    if (error) throw error;
    return toCamelCase(data);
  }
};

// Password Reset Operations
export const dbPasswordResetService = {
  // Store reset token
  async storeResetToken(email: string, token: string, userType: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('password_resets')
        .insert({
          email,
          token,
          user_type: userType,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          used: false
        });
      
      return !error;
    } catch (error) {
      console.error('Error storing reset token:', error);
      return false;
    }
  },

  // Verify reset token
  async verifyResetToken(token: string, email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('password_resets')
        .select('*')
        .eq('token', token)
        .eq('email', email)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single();
      
      return !error && data;
    } catch (error) {
      console.error('Error verifying reset token:', error);
      return false;
    }
  },

  // Mark token as used
  async markTokenAsUsed(token: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('password_resets')
        .update({ used: true })
        .eq('token', token);
      
      return !error;
    } catch (error) {
      console.error('Error marking token as used:', error);
      return false;
    }
  },

  // Update user password
  async updatePassword(email: string, newPassword: string, userType: string): Promise<boolean> {
    try {
      let table: string;
      
      switch (userType) {
        case 'institution':
          table = TABLES.INSTITUTIONS;
          break;
        case 'privateLibrary':
          table = TABLES.PRIVATE_LIBRARIES;
          break;
        case 'student':
          table = TABLES.STUDENTS;
          break;
        case 'admin':
          // For admin, you might have a separate admins table
          // For now, we'll handle this differently
          return false;
        default:
          return false;
      }

      const { error } = await supabase
        .from(table)
        .update({ password: newPassword })
        .eq('email', email);
      
      return !error;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  },

  // Get user type by email
  async getUserTypeByEmail(email: string): Promise<'institution' | 'student' | 'admin' | 'privateLibrary' | null> {
    try {
      // Check institutions
      const { data: institution } = await supabase
        .from(TABLES.INSTITUTIONS)
        .select('id')
        .eq('email', email)
        .single();
      
      if (institution) return 'institution';

      // Check private libraries
      const { data: privateLibrary } = await supabase
        .from(TABLES.PRIVATE_LIBRARIES)
        .select('id')
        .eq('email', email)
        .single();
      
      if (privateLibrary) return 'privateLibrary';

      // Check students
      const { data: student } = await supabase
        .from(TABLES.STUDENTS)
        .select('id')
        .eq('email', email)
        .single();
      
      if (student) return 'student';

      // Check admin (hardcoded for now)
      if (email === 'bookzonelibrary@outlook.com') return 'admin';

      return null;
    } catch (error) {
      console.error('Error getting user type:', error);
      return null;
    }
  }
}; 