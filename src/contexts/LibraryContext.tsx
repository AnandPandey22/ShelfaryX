import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, BookCategory, Student, BookIssue } from '../types';
import { bookService, categoryService, studentService, issueService, notificationService } from '../services/database';
import { useAuth } from './AuthContext';

interface LibraryContextType {
  books: Book[];
  categories: BookCategory[];
  students: Student[];
  issues: BookIssue[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addBook: (book: Omit<Book, 'id' | 'institutionId'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addCategory: (category: Omit<BookCategory, 'id' | 'bookCount' | 'institutionId'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<BookCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id' | 'institutionId'>) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  issueBook: (issue: Omit<BookIssue, 'id' | 'institutionId'>) => Promise<void>;
  returnBook: (issueId: string, fine?: number) => Promise<void>;
  getOverdueBooks: () => BookIssue[];
  getTopIssuedBooks: () => Book[];
  getTopActiveStudents: () => Student[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { institutionId, userType } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [loading, setLoading] = useState(true);

  // Use institutionId for both institutions and private libraries
  const entityId = institutionId;

  const loadData = async () => {
    if (!entityId) return;
    
    try {
      setLoading(true);
      const [booksData, categoriesData, studentsData, issuesData] = await Promise.all([
        bookService.getAllBooks(entityId),
        categoryService.getAllCategories(entityId),
        studentService.getAllStudents(entityId),
        issueService.getAllIssues(entityId)
      ]);

      setBooks(booksData);
      setCategories(categoriesData);
      setStudents(studentsData);
      setIssues(issuesData);
    } catch (error) {
      console.error('Error loading library data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [entityId]);

  const refreshData = async () => {
    await loadData();
  };

  const addBook = async (book: Omit<Book, 'id' | 'institutionId'>) => {
    if (!entityId) throw new Error('No entity ID');
    
    const bookWithInstitution = { ...book, institutionId: entityId };
    const newBook = await bookService.addBook(bookWithInstitution, entityId);
    setBooks(prev => [...prev, newBook]);
    
    // Update category book count
    if (book.categoryId) {
      await categoryService.updateBookCount(book.categoryId);
      await refreshData(); // Refresh to get updated counts
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const updatedBook = await bookService.updateBook(id, updates);
    setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
  };

  const deleteBook = async (id: string) => {
    await bookService.deleteBook(id);
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const addCategory = async (category: Omit<BookCategory, 'id' | 'bookCount' | 'institutionId'>) => {
    if (!entityId) throw new Error('No entity ID');
    
    const categoryWithInstitution = { ...category, institutionId: entityId };
    const newCategory = await categoryService.addCategory(categoryWithInstitution, entityId);
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = async (id: string, updates: Partial<BookCategory>) => {
    const updatedCategory = await categoryService.updateCategory(id, updates);
    setCategories(prev => prev.map(category => category.id === id ? updatedCategory : category));
  };

  const deleteCategory = async (id: string) => {
    await categoryService.deleteCategory(id);
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const addStudent = async (student: Omit<Student, 'id' | 'institutionId'>) => {
    if (!entityId) throw new Error('No entity ID');
    
    const studentWithInstitution = { ...student, institutionId: entityId };
    const newStudent = await studentService.addStudent(studentWithInstitution, entityId);
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    const updatedStudent = await studentService.updateStudent(id, updates);
    setStudents(prev => prev.map(student => student.id === id ? updatedStudent : student));
  };

  const deleteStudent = async (id: string) => {
    await studentService.deleteStudent(id);
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const issueBook = async (issue: Omit<BookIssue, 'id' | 'institutionId'>) => {
    if (!entityId) throw new Error('No entity ID');
    
    // Check if student already has 5 books issued
    const studentActiveIssues = issues.filter(issueItem => 
      issueItem.studentId === issue.studentId && 
      (issueItem.status === 'issued' || issueItem.status === 'overdue')
    );
    
    if (studentActiveIssues.length >= 5) {
      throw new Error('This student has already borrowed 5 books. Please return at least one book before issuing a new one.');
    }
    
    // Check if student already has this specific book
    const alreadyHasThisBook = studentActiveIssues.some(issueItem => issueItem.bookId === issue.bookId);
    if (alreadyHasThisBook) {
      throw new Error('This student has already borrowed this book. Please select a different book.');
    }
    
    const issueWithInstitution = { ...issue, institutionId: entityId };
    const newIssue = await issueService.issueBook(issueWithInstitution, entityId);
    setIssues(prev => [...prev, newIssue]);
    
    // Update book available copies
    const book = books.find(b => b.id === issue.bookId);
    if (book) {
      await updateBook(book.id, { availableCopies: book.availableCopies - 1 });
    }

    // Create notification for the student about the issued book
    try {
      await notificationService.createNotification({
        userId: issue.studentId,
        userType: 'student',
        title: 'Book Issued Successfully',
        message: `Your book "${book?.title}" has been issued successfully. Due date: ${issue.dueDate}. Please return it on time to avoid fines.`,
        type: 'issued',
        isRead: false,
        institutionId: entityId
      });
    } catch (error) {
      console.error('Error creating issue notification:', error);
    }
  };

  const returnBook = async (issueId: string, fine: number = 0) => {
    // Find the issue to check if it's overdue
    const issue = issues.find(i => i.id === issueId);
    const today = new Date().toLocaleDateString('en-CA');
    
    // If the book is overdue (due date <= today), apply ₹1000 fine
    let finalFine = fine;
    if (issue && issue.dueDate <= today && issue.status !== 'returned') {
      finalFine = 1000; // ₹1000 fixed fine for overdue books
    }
    
    await issueService.returnBook(issueId, finalFine);
    
    // Update issues list
    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, status: 'returned', returnDate: new Date().toLocaleDateString('en-CA'), fine: finalFine }
        : issue
    ));
    
    // Update book available copies
    if (issue) {
      const book = books.find(b => b.id === issue.bookId);
      if (book) {
        await updateBook(book.id, { availableCopies: book.availableCopies + 1 });
      }

      // Create notification for the student about the returned book
      try {
        if (book && entityId) {
          const fineMessage = finalFine > 0 ? ` Fine collected: ₹${finalFine}.` : '';
          await notificationService.createNotification({
            userId: issue.studentId,
            userType: 'student',
            title: 'Book Returned Successfully',
            message: `Your book "${book.title}" has been returned successfully.${fineMessage} Thank you for using the library!`,
            type: 'returned',
            isRead: false,
            institutionId: entityId
          });
        }
      } catch (error) {
        console.error('Error creating return notification:', error);
      }
    }
  };

  const updateOverdueStatus = async (issueId: string) => {
    try {
      await issueService.updateIssueStatus(issueId, 'overdue');
    } catch (error) {
      console.error('Error updating overdue status:', error);
    }
  };

  const getOverdueBooks = (): BookIssue[] => {
    const today = new Date().toLocaleDateString('en-CA'); // Use local date
    
    // Update overdue status for books that are due today or past due date
    const updatedIssues = issues.map(issue => {
      if (issue.status === 'issued' && issue.dueDate <= today) {
        // Update status in database
        updateOverdueStatus(issue.id);
        return { ...issue, status: 'overdue' as const };
      }
      return issue;
    });
    
    // Update the issues state if any statuses changed
    const hasChanges = updatedIssues.some((issue, index) => issue.status !== issues[index]?.status);
    if (hasChanges) {
      setIssues(updatedIssues);
    }
    
    // Return overdue books (both issued and overdue status)
    return updatedIssues.filter(issue => 
      (issue.status === 'issued' || issue.status === 'overdue') && issue.dueDate <= today
    );
  };

  const getTopIssuedBooks = (): Book[] => {
    const bookIssueCounts = issues.reduce((acc, issue) => {
      acc[issue.bookId] = (acc[issue.bookId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return books
      .map(book => ({ ...book, issueCount: bookIssueCounts[book.id] || 0 }))
      .sort((a, b) => (b as any).issueCount - (a as any).issueCount)
      .slice(0, 5);
  };

  const getTopActiveStudents = (): Student[] => {
    const studentIssueCounts = issues.reduce((acc, issue) => {
      acc[issue.studentId] = (acc[issue.studentId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return students
      .map(student => ({ ...student, issueCount: studentIssueCounts[student.id] || 0 }))
      .sort((a, b) => (b as any).issueCount - (a as any).issueCount)
      .slice(0, 5);
  };

  const value = {
    books,
    categories,
    students,
    issues,
    loading,
    refreshData,
    addBook,
    updateBook,
    deleteBook,
    addCategory,
    updateCategory,
    deleteCategory,
    addStudent,
    updateStudent,
    deleteStudent,
    issueBook,
    returnBook,
    getOverdueBooks,
    getTopIssuedBooks,
    getTopActiveStudents,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};