import React, { useState } from 'react';
import { Search, BookOpen, User, Calendar, CheckCircle } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';
import { useAuth } from '../contexts/AuthContext';
import { Book, Student } from '../types';

const IssueBook: React.FC = () => {
  const { books, students, issueBook, loading, issues, getTopIssuedBooks, getTopActiveStudents } = useLibrary();
  const { currentUser, institutionId } = useAuth();
  const [bookSearch, setBookSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchingBooks, setSearchingBooks] = useState(false);
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [studentResults, setStudentResults] = useState<Student[]>([]);
  
  const selectedBookData = books.find(b => b.id === selectedBook);
  const selectedStudentData = students.find(s => s.id === selectedStudent);

  // Set default issue date to today and due date to 14 days from now when component mounts
  React.useEffect(() => {
    const today = new Date();
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    
    setIssueDate(today.toLocaleDateString('en-CA')); // Use local date in YYYY-MM-DD format
    setDueDate(defaultDueDate.toLocaleDateString('en-CA')); // Use local date in YYYY-MM-DD format
  }, []);

  // Load top 5 books and students by default
  React.useEffect(() => {
    // Get top 5 most issued books
    const topBooks = getTopIssuedBooks();
    setBookResults(topBooks);

    // Get top 5 most active students
    const topStudents = getTopActiveStudents();
    setStudentResults(topStudents);
  }, [books, students, issues, getTopIssuedBooks, getTopActiveStudents]);

  const handleBookSearch = async (query: string) => {
    setBookSearch(query);
    if (query.trim()) {
      setSearchingBooks(true);
      try {
        // Filter books locally for now
        const results = books.filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.isbn.toLowerCase().includes(query.toLowerCase())
        );
        setBookResults(results);
      } catch (error) {
        console.error('Error searching books:', error);
        setBookResults([]);
      } finally {
        setSearchingBooks(false);
      }
    } else {
      // Show top 5 books when search is cleared
      const topBooks = getTopIssuedBooks();
      setBookResults(topBooks);
    }
  };

  const handleStudentSearch = async (query: string) => {
    setStudentSearch(query);
    if (query.trim()) {
      setSearchingStudents(true);
      try {
        // Filter students locally for now
        const results = students.filter(student => 
          student.name.toLowerCase().includes(query.toLowerCase()) ||
          student.studentId.toLowerCase().includes(query.toLowerCase()) ||
          student.course.toLowerCase().includes(query.toLowerCase())
        );
        setStudentResults(results);
      } catch (error) {
        console.error('Error searching students:', error);
        setStudentResults([]);
      } finally {
        setSearchingStudents(false);
      }
    } else {
      // Show top 5 students when search is cleared
      const topStudents = getTopActiveStudents();
      setStudentResults(topStudents);
    }
  };

  const handleIssueBook = async () => {
    if (selectedBook && selectedStudent && currentUser && issueDate && dueDate) {
      // Check if student already has 5 books issued
      const studentActiveIssues = issues.filter(issue => 
        issue.studentId === selectedStudent && 
        (issue.status === 'issued' || issue.status === 'overdue')
      );
      
      if (studentActiveIssues.length >= 5) {
        setErrorMessage('This student has already borrowed 5 books. Please return at least one book before issuing a new one.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        return;
      }
      
      // Check if student already has this specific book
      const alreadyHasThisBook = studentActiveIssues.some(issue => issue.bookId === selectedBook);
      if (alreadyHasThisBook) {
        setErrorMessage('This student has already borrowed this book. Please select a different book.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        return;
      }
      
      setIssuing(true);
      try {
        await issueBook({
          bookId: selectedBook,
          studentId: selectedStudent,
          issueDate: issueDate, // Use selected issue date
          dueDate: dueDate,
          status: 'issued',
          fine: 0,
          issuedBy: currentUser.name
        });
        
        setSelectedBook(null);
        setSelectedStudent(null);
        setBookSearch('');
        setStudentSearch('');
        
        // Reset to default top 5 lists
        const topBooks = getTopIssuedBooks();
        setBookResults(topBooks);

        const topStudents = getTopActiveStudents();
        setStudentResults(topStudents);
        
        // Reset dates to defaults
        const today = new Date();
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 14);
        
        setIssueDate(today.toLocaleDateString('en-CA'));
        setDueDate(defaultDueDate.toLocaleDateString('en-CA'));
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error('Error issuing book:', error);
        setErrorMessage('Error issuing book. Please try again.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      } finally {
        setIssuing(false);
      }
    }
  };

  // Check if student has reached the 5-book limit
  const studentActiveIssues = selectedStudent ? issues.filter(issue => 
    issue.studentId === selectedStudent && 
    (issue.status === 'issued' || issue.status === 'overdue')
  ) : [];
  
  const hasReachedLimit = studentActiveIssues.length >= 5;
  const alreadyHasThisBook = selectedBook && studentActiveIssues.some(issue => issue.bookId === selectedBook);
  
  const canIssue = selectedBook && 
                   selectedStudent && 
                   selectedBookData && 
                   selectedBookData.availableCopies > 0 && 
                   issueDate && 
                   dueDate && 
                   !hasReachedLimit && 
                   !alreadyHasThisBook;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issue book data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issue Book</h1>
        <p className="text-gray-600 mt-2">Issue books to registered students</p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            📚 <strong>Book Limit Policy:</strong> Each student can borrow a maximum of 5 different books at a time. 
            Students must return at least one book before borrowing a new one.
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Book issued successfully!</span>
          </div>
        </div>
      )}

      {showError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-red-600">⚠️</div>
            <span className="text-red-800 font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Book Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Select Book</span>
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                value={bookSearch}
                onChange={(e) => handleBookSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
          </div>

            {searchingBooks && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Searching books...</p>
              </div>
            )}
            
            {bookResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {!bookSearch.trim() && (
                  <p className="text-sm text-gray-500 mb-2">📚 Top 5 most issued books:</p>
                )}
            {bookResults.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedBook === book.id 
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                    <div>
                    <h3 className="font-medium text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                      <p className="text-xs text-gray-500">Available: {book.availableCopies} of {book.totalCopies}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedBookData && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">Selected Book</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Title:</span> {selectedBookData.title}</p>
                  <p><span className="font-medium">Author:</span> {selectedBookData.author}</p>
                  <p><span className="font-medium">ISBN:</span> {selectedBookData.isbn}</p>
                  <p><span className="font-medium">Available Copies:</span> {selectedBookData.availableCopies}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-green-600" />
            <span>Select Student</span>
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students by name or student ID..."
                value={studentSearch}
                onChange={(e) => handleStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
          </div>

            {searchingStudents && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Searching students...</p>
              </div>
            )}
            
            {studentResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {!studentSearch.trim() && (
                  <p className="text-sm text-gray-500 mb-2">👥 Top 5 most active students:</p>
                )}
            {studentResults.map((student) => {
              const studentBookCount = issues.filter(issue => 
                issue.studentId === student.id && 
                (issue.status === 'issued' || issue.status === 'overdue')
              ).length;
              
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedStudent === student.id 
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                      <p className="text-xs text-gray-500">{student.class} - {student.section}</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      studentBookCount >= 5 
                        ? 'bg-red-100 text-red-800' 
                        : studentBookCount >= 3 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {studentBookCount}/5 books
                    </div>
                  </div>
                </div>
              );
            })}
              </div>
            )}
            
            {selectedStudentData && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">Selected Student</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedStudentData.name}</p>
                  <p><span className="font-medium">Student ID:</span> {selectedStudentData.studentId}</p>
                  <p><span className="font-medium">Class:</span> {selectedStudentData.class}</p>
                  <p><span className="font-medium">Section:</span> {selectedStudentData.section}</p>
                  <p className={`font-medium ${hasReachedLimit ? 'text-red-600' : 'text-gray-700'}`}>
                    Books Borrowed: {studentActiveIssues.length}/5
                  </p>
                  {hasReachedLimit && (
                    <p className="text-red-600 text-xs mt-1">
                      ⚠️ Student has reached the maximum limit of 5 books
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Set Dates</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issue Date */}
          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <input
              type="date"
              id="issueDate"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Select the date when the book is being issued (defaults to today)
            </p>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={issueDate || new Date().toLocaleDateString('en-CA')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Select the date when the book should be returned
            </p>
          </div>
        </div>
      </div>

      {/* Issue Button */}
      <div className="flex justify-center">
            <button
              onClick={handleIssueBook}
          disabled={!canIssue || issuing}
          className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            canIssue && !issuing
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
          {issuing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Issuing...</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>Issue Book</span>
            </>
          )}
            </button>
      </div>

      {selectedBookData && selectedStudentData && issueDate && dueDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Issue Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-medium">Book:</span> {selectedBookData.title}</p>
              <p><span className="font-medium">Student:</span> {selectedStudentData.name}</p>
            </div>
            <div>
              <p><span className="font-medium">Issue Date:</span> {new Date(issueDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Due Date:</span> {new Date(dueDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Issued By:</span> {currentUser?.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueBook;