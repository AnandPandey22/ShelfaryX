export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  password: string;
  class: string;
  section: string;
  mobileNumber: string;
  address: string;
  collegeBranch: string;
  branch: string;
  course: string;
  college: string;
  institutionId: string;
  joinDate: string;
  isActive: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId?: string;
  category?: string;
  publisher: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  imageUrl?: string;
  institutionId: string;
}

export interface BookCategory {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  institutionId: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine: number;
  issuedBy: string; // librarian name
  institutionId: string;
}

export interface Librarian {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  institutionId: string;
}

export interface Institution {
  id: string;
  name: string;
  email: string;
  password: string;
  address?: string;
  phone: string;
  website?: string;
  collegeCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface PrivateLibrary {
  id: string;
  name: string;
  email: string;
  password: string;
  address?: string;
  phone: string;
  website?: string;
  libraryCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  userType: 'institution' | 'student' | 'admin' | 'privateLibrary';
  isActive: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface Notification {
  id: string;
  userId: string;
  userType: 'institution' | 'student' | 'privateLibrary';
  title: string;
  message: string;
  type: 'overdue' | 'due_soon' | 'returned' | 'issued';
  isRead: boolean;
  createdAt: string;
  institutionId: string;
}