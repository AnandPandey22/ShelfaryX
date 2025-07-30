import React from 'react';
import { BookOpen, User, Calendar, Download, FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../contexts/AuthContext';
import { Book, BookIssue } from '../../types';

interface StudentDownloadInvoiceProps {
  books: Book[];
  issuedBooks: BookIssue[];
}

const StudentDownloadInvoice: React.FC<StudentDownloadInvoiceProps> = ({ books, issuedBooks }) => {
  const { currentUser } = useAuth();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get only the current student's issued books
  const studentIssuedBooks = issuedBooks.filter(issue => 
    issue.studentId === currentUser?.id && 
    (issue.status === 'issued' || issue.status === 'overdue')
  );

  // Generate PDF invoice for student
  const generateInvoice = (issue: BookIssue) => {
    console.log('Generating invoice for issue:', issue);
    
    // Validate issue object
    if (!issue || !issue.bookId || !issue.issueDate || !issue.dueDate) {
      console.error('Invalid issue object:', issue);
      alert('Invalid issue data. Please try again.');
      return;
    }
    
    const book = books.find(b => b.id === issue.bookId);
    
    console.log('Found book:', book);
    console.log('Current user:', currentUser);
    
    if (!book || !currentUser) {
      alert('Book or user information not found. Please try again.');
      return;
    }

    // Validate book and user data
    if (!book.title || !currentUser.name || !(currentUser as any).studentId) {
      console.error('Missing required book or user data:', { book, currentUser });
      alert('Missing required book or user data. Please try again.');
      return;
    }

    try {
      console.log('Creating PDF document...');
      const doc = new jsPDF();
      
      // Header Section
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text('BookZone', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128); // Gray color
      doc.text('Library Management System', 105, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text('bookzonelibrary@outlook.com', 105, 40, { align: 'center' });
      doc.text('+91-9878955679', 105, 47, { align: 'center' });
      
      // Invoice Title
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('BOOK ISSUE INVOICE', 105, 65, { align: 'center' });
      
      // Invoice Details (Two columns)
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Left column
      doc.text('Invoice Date:', 20, 80);
      doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), 50, 80);
      
      doc.text('Invoice #:', 20, 87);
      doc.text(`INV-${Math.random().toString(36).substr(2, 8).toUpperCase()}`, 50, 87);
      
      doc.text('Order Date:', 20, 94);
      doc.text(formatDate(issue.issueDate), 50, 94);
      
      // Right column
      doc.text('Issue Date:', 120, 80);
      doc.text(formatDate(issue.issueDate), 150, 80);
      
      doc.text('Due Date:', 120, 87);
      doc.text(formatDate(issue.dueDate), 150, 87);
      
      doc.text('Issued By:', 120, 94);
     doc.text(issue.issuedBy || 'Institution', 150, 94);
      
      // Student Information Section
      doc.setFontSize(12);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text('STUDENT INFORMATION', 20, 110);
      
      // Student info table
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Table headers
      doc.setFillColor(243, 244, 246); // Light gray background
      doc.rect(20, 115, 170, 8, 'F');
      doc.text('Field', 25, 121);
      doc.text('Details', 100, 121);
      
      // Student data rows
      doc.text('Name', 25, 135);
      doc.text(currentUser.name, 100, 135);
      
      doc.text('Student ID', 25, 142);
      doc.text((currentUser as any).studentId, 100, 142);
      
      doc.text('Class', 25, 149);
      doc.text((currentUser as any).class || 'N/A', 100, 149);
      
      doc.text('Contact', 25, 156);
      doc.text((currentUser as any).mobileNumber || 'N/A', 100, 156);
      
      doc.text('Address', 25, 163);
      doc.text((currentUser as any).address || 'N/A', 100, 163);
      
      // Book Information Section
      doc.setFontSize(12);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text('BOOK INFORMATION', 20, 180);
      
      // Book info table
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // Table headers
      doc.setFillColor(243, 244, 246); // Light gray background
      doc.rect(20, 185, 170, 8, 'F');
      doc.text('Field', 25, 191);
      doc.text('Details', 100, 191);
      
      // Book data rows
      doc.text('Title', 25, 205);
      doc.text(book.title, 100, 205);
      
      doc.text('Author', 25, 212);
      doc.text(book.author, 100, 212);
      
      doc.text('ISBN', 25, 219);
      doc.text(book.isbn, 100, 219);
      
      doc.text('Category', 25, 226);
      doc.text(book.category || 'N/A', 100, 226);
      
      // Fine Policy Section
      doc.setFontSize(12);
      doc.setTextColor(239, 68, 68); // Red color
      doc.text('FINE POLICY', 20, 245);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Books must be returned before the due date. If not, a fixed fine of Rs.1000 will be charged and the book will be reclaimed.', 20, 255, { maxWidth: 170 });
      
      // Download the PDF
      const fileName = `BookZone_Invoice_${(currentUser as any).studentId}_${book.title.replace(/\s+/g, '_')}.pdf`;
      console.log('Saving PDF as:', fileName);
      doc.save(fileName);
      
      console.log('PDF generated successfully!');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        book: book,
        currentUser: currentUser,
        issue: issue
      });
      alert(`Error generating PDF: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 lg:p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold">Download Invoice</h1>
        <p className="text-indigo-100 mt-2">Download invoices for your issued books</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Your Issued Books - Invoice Generation
          </h2>
        </div>
        
        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {studentIssuedBooks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-400">No issued books found</p>
                  <p className="text-sm text-gray-400">You don't have any currently issued books</p>
                </div>
              </div>
            ) : (
              studentIssuedBooks.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const today = new Date();
                const dueDate = new Date(issue.dueDate);
                const isOverdue = dueDate < today;
                const daysOverdue = isOverdue ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                
                return (
                  <div key={issue.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{book?.title}</h3>
                          <p className="text-sm text-gray-600">by {book?.author}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateInvoice(issue)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isOverdue 
                              ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200' 
                              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                          }`}>
                            {isOverdue ? (
                              <>
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Overdue ({daysOverdue} days)
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                On Time
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">ISBN:</span>
                        <div className="mt-1 text-gray-900">
                          {book?.isbn}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Issue Date:</span>
                        <div className="flex items-center mt-1 text-gray-900">
                          <Calendar className="w-3 h-3 mr-1 text-indigo-500" />
                          {formatDate(issue.issueDate)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Due Date:</span>
                        <div className="flex items-center mt-1 text-gray-900">
                          <Clock className="w-3 h-3 mr-1 text-indigo-500" />
                          {formatDate(issue.dueDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Book</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Issue Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {studentIssuedBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-400">No issued books found</p>
                      <p className="text-sm text-gray-400">You don't have any currently issued books</p>
                    </div>
                  </td>
                </tr>
              )}
              {studentIssuedBooks.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const today = new Date();
                const dueDate = new Date(issue.dueDate);
                const isOverdue = dueDate < today;
                const daysOverdue = isOverdue ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                
                return (
                  <tr key={issue.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{book?.title}</div>
                          <div className="text-sm text-gray-600">{book?.author}</div>
                          <div className="text-xs text-gray-500">ISBN: {book?.isbn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                        {formatDate(issue.issueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                        {formatDate(issue.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          isOverdue 
                            ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200' 
                            : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                        }`}>
                          {isOverdue ? (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Overdue ({daysOverdue} days)
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              On Time
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => generateInvoice(issue)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-xl p-4 lg:p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Invoice Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-2">What's included in your invoice:</p>
            <ul className="space-y-1">
              <li>• Student information and details</li>
              <li>• Book title, author, and ISBN</li>
              <li>• Issue date and due date</li>
              <li>• Current status and fine information</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Fine Policy:</p>
            <ul className="space-y-1">
              <li>• No fine if returned on time</li>
              <li>• ₹1000 fine for overdue books</li>
              <li>• Fine increases with overdue days</li>
              <li>• Pay fines at the library counter</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDownloadInvoice; 
