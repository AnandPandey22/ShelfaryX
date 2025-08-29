import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { useAuth } from '../contexts/AuthContext';
import { institutionService, privateLibraryService } from '../services/database';
import { BookOpen, User, Calendar, Download, FileText, MapPin, Phone, Mail, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

const DownloadInvoice: React.FC = () => {
  const { books, students, issues } = useLibrary();
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

  // Get issued and overdue books (not returned)
  const issuedBooks = issues.filter(issue => issue.status === 'issued' || issue.status === 'overdue');

  // Generate PDF invoice
  const generateInvoice = async (issue: any) => {
    console.log('Generating invoice for issue:', issue);
    
    // Validate issue object
    if (!issue || !issue.bookId || !issue.studentId || !issue.issueDate || !issue.dueDate) {
      console.error('Invalid issue object:', issue);
      alert('Invalid issue data. Please try again.');
      return;
    }
    
    const book = books.find(b => b.id === issue.bookId);
    const student = students.find(s => s.id === issue.studentId);
    
    console.log('Found book:', book);
    console.log('Found student:', student);
    
    if (!book || !student) {
      alert('Book or student information not found. Please try again.');
      return;
    }

    // Validate book and student data
    if (!book.title || !student.name || !student.studentId) {
      console.error('Missing required book or student data:', { book, student });
      alert('Missing required book or student data. Please try again.');
      return;
    }

    try {
      // Get institution/private library details for issuer information
      let issuerEmail = 'shelfaryx@outlook.com';
      let issuerPhone = '+91-9878955679';
      let issuerName = currentUser?.name || 'Library';
      
      if (issue.institutionId) {
        try {
          // First try to get institution details
          const institution = await institutionService.getInstitutionById(issue.institutionId);
          if (institution) {
            issuerEmail = institution.email;
            issuerPhone = institution.phone;
            issuerName = institution.name;
          } else {
            // If not found in institutions, try private libraries
            const privateLibrary = await privateLibraryService.getPrivateLibraryById(issue.institutionId);
            if (privateLibrary) {
              issuerEmail = privateLibrary.email;
              issuerPhone = privateLibrary.phone;
              issuerName = privateLibrary.name;
            }
          }
        } catch (error) {
          console.warn('Could not fetch institution/private library details:', error);
        }
      }

      console.log('Creating PDF document...');
      const doc = new jsPDF();
      
      // Header Section
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text(currentUser?.name || issuerName || 'Library', 105, 20, { align: 'center' });
      
      doc.setFontSize(13);
      doc.setTextColor(107, 114, 128); // Gray color
      doc.text('Your Path to Success', 105, 29, { align: 'center' });
      
      doc.setFontSize(11);
      doc.text(issuerEmail, 105, 36, { align: 'center' });
      doc.text(issuerPhone, 105, 43, { align: 'center' });
      
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
      doc.text(`INV-${String(issue.id)}`, 50, 87);
      
      doc.text('Order Date:', 20, 94);
      doc.text(formatDate(issue.issueDate), 50, 94);

       doc.text('Issuer Phone:', 20, 101);
      doc.text(issuerPhone, 50, 101);
      
      // Right column
      doc.text('Issue Date:', 120, 80);
      doc.text(formatDate(issue.issueDate), 150, 80);
      
      doc.text('Due Date:', 120, 87);
      doc.text(formatDate(issue.dueDate), 150, 87);
      
      doc.text('Issued By:', 120, 94);
      doc.text(currentUser?.name || 'ShelfaryX', 150, 94);

      doc.text('Issuer Email:', 120, 101);
      doc.text(issuerEmail, 150, 101);
      
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
      doc.text(student.name, 100, 135);
      
      doc.text('Student ID', 25, 142);
      doc.text(student.studentId, 100, 142);
      
      doc.text('Class', 25, 149);
      doc.text(student.class || 'N/A', 100, 149);
      
      doc.text('Contact', 25, 156);
      doc.text(student.mobileNumber || 'N/A', 100, 156);
      
      doc.text('Address', 25, 163);
      doc.text(student.address || 'N/A', 100, 163);
      
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
      
      // Add Powered by ShelfaryX footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); // Gray color
      doc.text('Powered by ShelfaryX', 105, 285, { align: 'center' });
      
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
      const fileName = `ShelfaryX_Invoice_${student.studentId}_${book.title.replace(/\s+/g, '_')}.pdf`;
      console.log('Saving PDF as:', fileName);
      doc.save(fileName);
      
      console.log('PDF generated successfully!');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        book: book,
        student: student,
        issue: issue
      });
      alert(`Error generating PDF: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 lg:p-6 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold">Download Invoice</h1>
        <p className="text-indigo-100 mt-2">Generate and download professional invoices for issued books</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Issued Books - Invoice Generation
          </h2>
        </div>
        
        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {issuedBooks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-400">No issued books found</p>
                  <p className="text-sm text-gray-400">Issue some books to generate invoices</p>
                </div>
              </div>
            ) : (
              issuedBooks.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const student = students.find(s => s.id === issue.studentId);
                const today = new Date().toLocaleDateString('en-CA');
                const isOverdue = issue.dueDate <= today;
                
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
                        <span className="text-gray-500">Student:</span>
                        <div className="flex items-center mt-1">
                          <div className="h-6 w-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-2">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <div className="text-gray-900 font-medium">{student?.name}</div>
                            <div className="text-xs text-gray-500">{student?.studentId}</div>
                          </div>
                        </div>
                      </div>
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
                                Overdue - ₹1000 Fine
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                On Time - No Fine
                              </>
                            )}
                          </span>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Issue Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Fine Policy</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider bg-gradient-to-r from-indigo-50 to-purple-50">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {issuedBooks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-400">No issued books found</p>
                      <p className="text-sm text-gray-400">Issue some books to generate invoices</p>
                    </div>
                  </td>
                </tr>
              )}
              {issuedBooks.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const student = students.find(s => s.id === issue.studentId);
                const today = new Date().toLocaleDateString('en-CA');
                const isOverdue = issue.dueDate <= today;
                
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{student?.name}</div>
                          <div className="text-sm text-gray-600">{student?.studentId}</div>
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
                              Overdue - ₹1000
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
                        Download
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Issued</p>
              <p className="text-3xl font-bold">{issuedBooks.length}</p>
            </div>
            <FileText className="w-10 h-10 text-indigo-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Overdue Books</p>
              <p className="text-3xl font-bold">
                {issuedBooks.filter(i => {
                  const today = new Date().toLocaleDateString('en-CA');
                  return i.dueDate <= today;
                }).length}
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Potential Fines</p>
              <p className="text-3xl font-bold">
                ₹{issuedBooks.filter(i => {
                  const today = new Date().toLocaleDateString('en-CA');
                  return i.dueDate <= today;
                }).length * 1000}
              </p>
            </div>
            <FileText className="w-10 h-10 text-yellow-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadInvoice; 
