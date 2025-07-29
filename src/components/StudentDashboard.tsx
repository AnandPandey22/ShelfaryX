import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, AlertTriangle, Bell, CheckCircle, Eye, Building2, Calendar, ChevronDown, X, BookOpenCheck, CalendarDays, Hash, User, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Book, BookIssue, Notification } from '../types';
import { bookService, issueService, notificationService, institutionService, categoryService } from '../services/database';
import StudentSidebar from './Layout/StudentSidebar';
import StudentMobileSidebar from './Layout/StudentMobileSidebar';
import StudentMobileHeader from './Layout/StudentMobileHeader';
import StudentProfile from './StudentProfile';
import StudentDownloadInvoice from './Student/StudentDownloadInvoice';

const StudentDashboard: React.FC = () => {
  const { currentUser, institutionId, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]); // Store all books
  const [issuedBooks, setIssuedBooks] = useState<BookIssue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [institution, setInstitution] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookPopup, setShowBookPopup] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (currentUser && institutionId) {
      loadData();
    }
  }, [currentUser, institutionId]);



  // Live search and category filter effect with debouncing
  useEffect(() => {
    if (!institutionId) return;

    const timeoutId = setTimeout(() => {
      let filteredBooks = allBooks;

      // Apply category filter
      if (selectedCategory !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setBooks(filteredBooks);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, allBooks, institutionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load institution data
      const institutionData = await institutionService.getInstitutionById(institutionId!);
      setInstitution(institutionData);
      
      // Load all books
      const allBooksData = await bookService.getAllBooks(institutionId!);
      setAllBooks(allBooksData);
      setBooks(allBooksData); // Initially show all books

      // Load categories
      const categoriesData = await categoryService.getAllCategories(institutionId!);
      setCategories(categoriesData);

      // Load issued books
      const studentIssues = await issueService.getStudentIssues(currentUser!.id);
      setIssuedBooks(studentIssues);

      // Load notifications
      const userNotifications = await notificationService.getUserNotifications(
        currentUser!.id,
        'student',
        institutionId!
      );
      setNotifications(userNotifications);

      // Generate notifications for overdue and due soon books
      await generateNotifications(studentIssues, allBooksData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate notifications for overdue and due soon books
  const generateNotifications = async (issues: BookIssue[], allBooks: Book[]) => {
    if (!currentUser || !institutionId) return;

    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));

    console.log('Generating notifications for student:', currentUser.id);
    console.log('Total issues to check:', issues.length);

    // Get existing notifications to check for duplicates (only from today)
    const existingNotifications = await notificationService.getUserNotifications(
      currentUser.id,
      'student',
      institutionId
    );
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayNotifications = existingNotifications.filter(n => 
      new Date(n.createdAt) >= todayStart
    );

    for (const issue of issues) {
      if (issue.status !== 'issued') {
        console.log('Skipping non-issued book:', issue.id);
        continue;
      }

      const book = allBooks.find(b => b.id === issue.bookId);
      if (!book) {
        console.log('Book not found for issue:', issue.bookId);
        continue;
      }

      const dueDate = new Date(issue.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      console.log(`Checking book: ${book.title}, due date: ${dueDate.toDateString()}, days until due: ${daysUntilDue}`);

      // Check if book is overdue
      if (dueDate <= today) {
        // Check if overdue notification already exists for this book today
        const existingOverdueNotification = todayNotifications.find(n => 
          n.type === 'overdue' && 
          n.message.includes(book.title)
        );

        if (!existingOverdueNotification) {
          console.log(`📚 Book "${book.title}" is OVERDUE - creating notification`);
          try {
            await notificationService.createOverdueNotification(
              currentUser.id,
              book.title,
              institutionId
            );
            console.log('✅ Overdue notification created successfully');
          } catch (error) {
            console.error('❌ Error creating overdue notification:', error);
          }
        } else {
          console.log(`ℹ️ Overdue notification already exists for "${book.title}" today`);
        }
      }
      // Check if book is due soon (within 3 days)
      else if (dueDate <= threeDaysFromNow && daysUntilDue > 0) {
        // Check if due soon notification already exists for this book today
        const existingDueSoonNotification = todayNotifications.find(n => 
          n.type === 'due_soon' && 
          n.message.includes(book.title)
        );

        if (!existingDueSoonNotification) {
          console.log(`⏰ Book "${book.title}" is due in ${daysUntilDue} days - creating notification`);
          try {
            await notificationService.createDueSoonNotification(
              currentUser.id,
              book.title,
              daysUntilDue,
              institutionId
            );
            console.log('✅ Due soon notification created successfully');
          } catch (error) {
            console.error('❌ Error creating due soon notification:', error);
          }
        } else {
          console.log(`ℹ️ Due soon notification already exists for "${book.title}" today`);
        }
      } else {
        console.log(`📖 Book "${book.title}" is not overdue or due soon (${daysUntilDue} days until due)`);
      }
    }

    // Always reload notifications after generating
    try {
      const updatedNotifications = await notificationService.getUserNotifications(
        currentUser.id,
        'student',
        institutionId
      );
      setNotifications(updatedNotifications);
      
      // Log summary of notifications
      const overdueCount = updatedNotifications.filter(n => n.type === 'overdue').length;
      const dueSoonCount = updatedNotifications.filter(n => n.type === 'due_soon').length;
      const otherCount = updatedNotifications.filter(n => !['overdue', 'due_soon'].includes(n.type)).length;
      
      console.log('📊 Notification Summary:');
      console.log(`   - Overdue notifications: ${overdueCount}`);
      console.log(`   - Due soon notifications: ${dueSoonCount}`);
      console.log(`   - Other notifications: ${otherCount}`);
      console.log(`   - Total notifications: ${updatedNotifications.length}`);
    } catch (error) {
      console.error('Error reloading notifications:', error);
    }
  };

  const getOverdueBooks = () => {
    const today = new Date();
    return issuedBooks.filter(issue => {
      const dueDate = new Date(issue.dueDate);
      return issue.status === 'issued' && dueDate < today;
    });
  };

  const getDueSoonBooks = () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    return issuedBooks.filter(issue => {
      const dueDate = new Date(issue.dueDate);
      return issue.status === 'issued' && dueDate >= today && dueDate <= threeDaysFromNow;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowBookPopup(true);
  };

  const closeBookPopup = () => {
    setShowBookPopup(false);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const overdueBooks = getOverdueBooks();
  const dueSoonBooks = getDueSoonBooks();
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome, {currentUser?.name}!
                  </h1>
                  <p className="text-gray-600">
                    Access your college library resources and manage your borrowed books.
                  </p>
                </div>
                <div className="lg:text-right">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center lg:justify-end">
                      <Building2 className="w-5 h-5 text-gray-500 mr-2" />
                      <div className="text-lg font-semibold text-gray-900 break-words">
                        {institution?.name || 'Loading...'}
                      </div>
                    </div>
                    {institution?.collegeCode && (
                      <div className="text-sm text-gray-600 lg:ml-7">
                        Code: {institution.collegeCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Currently Issued</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {issuedBooks.filter(issue => issue.status === 'issued').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg mr-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">{overdueBooks.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Due Soon</p>
                    <p className="text-2xl font-bold text-gray-900">{dueSoonBooks.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                    <Bell className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">{unreadNotifications.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Books Section */}
            <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-400px)]">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Books</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search books by title, author, or ISBN..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative sm:w-48">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {books.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.map((book) => (
                      <div 
                        key={book.id} 
                        className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 hover:shadow-md"
                        onClick={() => handleBookClick(book)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{book.title}</h3>
                          {book.category && (
                            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                              {book.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                        <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm px-2 py-1 rounded ${
                            book.availableCopies > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {book.availableCopies > 0 ? 'Available' : 'Not Available'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {book.availableCopies}/{book.totalCopies} copies
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Books In College Library</h3>
                    <p className="text-gray-600">The library collection is currently empty.</p>
                    <p className="text-sm text-gray-400 mt-2">Please contact your librarian to add books to the collection.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'issued-books':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Currently Issued Books</h1>
              <p className="text-gray-600">Books you have borrowed from the library</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
                <div className="p-6 space-y-4">
                  {issuedBooks.filter(issue => issue.status === 'issued').length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Issued</h3>
                      <p className="text-gray-500">You haven't borrowed any books from the library yet.</p>
                      <p className="text-sm text-gray-400 mt-2">Visit the dashboard to search and borrow books.</p>
                    </div>
                  ) : (
                    issuedBooks.filter(issue => issue.status === 'issued').map((issue) => {
                      const book = books.find(b => b.id === issue.bookId);
                      const daysUntilDue = getDaysUntilDue(issue.dueDate);
                      const isOverdue = daysUntilDue < 0;
                      const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

                      return (
                        <div key={issue.id} className={`border rounded-lg p-4 ${
                          isOverdue ? 'border-red-200 bg-red-50' :
                          isDueSoon ? 'border-yellow-200 bg-yellow-50' :
                          'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{book?.title}</h3>
                              <p className="text-sm text-gray-600">by {book?.author}</p>
                              <p className="text-sm text-gray-500">
                                Issued: {formatDate(issue.issueDate)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Due: {formatDate(issue.dueDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              {isOverdue && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Overdue
                                </span>
                              )}
                              {isDueSoon && !isOverdue && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Due Soon
                                </span>
                              )}
                              <p className={`text-sm font-medium mt-1 ${
                                isOverdue ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Returned Books History</h1>
              <p className="text-gray-600">Books you have previously returned to the library</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
                <div className="p-6 space-y-4">
                  {issuedBooks.filter(issue => issue.status === 'returned').map((issue) => {
                    const book = books.find(b => b.id === issue.bookId);
                    return (
                      <div key={issue.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{book?.title}</h3>
                            <p className="text-sm text-gray-600">by {book?.author}</p>
                            <p className="text-sm text-gray-500">
                              Issued: {formatDate(issue.issueDate)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Due: {formatDate(issue.dueDate)}
                            </p>
                            {issue.returnDate && (
                              <p className="text-sm text-gray-500">
                                Returned: {formatDate(issue.returnDate)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Returned
                            </span>
                            {issue.fine > 0 && (
                              <p className="text-sm text-red-600 mt-1">
                                Fine: ₹{issue.fine}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'overdue':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Overdue Books</h1>
              <p className="text-gray-600">Books that are past their due date</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
                <div className="p-6 space-y-4">
                  {overdueBooks.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No overdue books</p>
                    </div>
                  ) : (
                    overdueBooks.map((issue) => {
                      const book = books.find(b => b.id === issue.bookId);
                      const daysOverdue = Math.abs(getDaysUntilDue(issue.dueDate));
                      
                      return (
                        <div key={issue.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{book?.title}</h3>
                              <p className="text-sm text-gray-600">by {book?.author}</p>
                              <p className="text-sm text-gray-500">
                                Issued: {formatDate(issue.issueDate)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Due: {formatDate(issue.dueDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </span>
                              <p className="text-sm font-medium text-red-600 mt-1">
                                {daysOverdue} days overdue
                              </p>
                              <p className="text-sm text-red-600 mt-1">
                                Fine: ₹1000
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'due-soon':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Due Soon</h1>
              <p className="text-gray-600">Books due within the next 3 days</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
                <div className="p-6 space-y-4">
                  {dueSoonBooks.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No books due soon</p>
                    </div>
                  ) : (
                    dueSoonBooks.map((issue) => {
                      const book = books.find(b => b.id === issue.bookId);
                      const daysUntilDue = getDaysUntilDue(issue.dueDate);
                      
                      return (
                        <div key={issue.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{book?.title}</h3>
                              <p className="text-sm text-gray-600">by {book?.author}</p>
                              <p className="text-sm text-gray-500">
                                Issued: {formatDate(issue.issueDate)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Due: {formatDate(issue.dueDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="w-3 h-3 mr-1" />
                                Due Soon
                              </span>
                              <p className="text-sm font-medium text-yellow-600 mt-1">
                                {daysUntilDue} days left
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'download-invoice':
        return (
          <StudentDownloadInvoice 
            books={books} 
            issuedBooks={issuedBooks} 
          />
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Library updates and important alerts</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
                <div className="p-6 space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className={`border rounded-lg p-4 ${
                        notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="ml-4 text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return <StudentProfile />;

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Section not found.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Header */}
      <StudentMobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
      
      {/* Mobile Sidebar */}
      <StudentMobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Desktop Sidebar */}
      <StudentSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        unreadNotificationsCount={unreadNotifications.length}
      />
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16">
        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>

      {/* Book Details Popup */}
      {showBookPopup && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedBook.title}</h2>
                <p className="text-lg text-gray-600">by {selectedBook.author}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">ISBN</p>
                      <p className="text-gray-900">{selectedBook.isbn}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <BookOpenCheck className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="text-gray-900">{selectedBook.category || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Publisher</p>
                      <p className="text-gray-900">{selectedBook.publisher || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Copies</p>
                      <p className="text-gray-900">{selectedBook.totalCopies}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Available Copies</p>
                      <p className={`font-semibold ${
                        selectedBook.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedBook.availableCopies}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarDays className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Publication Year</p>
                      <p className="text-gray-900">{selectedBook.publishYear || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedBook.description && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedBook.description}</p>
                </div>
              )}



              {/* Availability Status */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Availability Status</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedBook.availableCopies > 0 
                        ? `${selectedBook.availableCopies} out of ${selectedBook.totalCopies} copies available`
                        : 'All copies are currently borrowed'
                      }
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedBook.availableCopies > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedBook.availableCopies > 0 ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={closeBookPopup}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard; 