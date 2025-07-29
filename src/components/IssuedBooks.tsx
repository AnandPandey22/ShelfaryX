import React, { useState } from 'react';
import { Search, BookOpen, User, Calendar, RotateCcw, AlertTriangle } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';

const IssuedBooks: React.FC = () => {
  const { books, students, issues, returnBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Helper function to format date (show only date, not time)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredIssues = issues.filter(issue => {
    const book = books.find(b => b.id === issue.bookId);
    const student = students.find(s => s.id === issue.studentId);
    
    const matchesSearch = !searchTerm || 
      book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book?.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleReturnBook = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    const today = new Date().toLocaleDateString('en-CA');
    const isOverdue = issue && issue.dueDate <= today && issue.status !== 'returned';
    
    let message = 'Are you sure you want to mark this book as returned?';
    if (isOverdue) {
      message = 'This book is overdue. A fine of ₹1000 will be applied. Are you sure you want to return it?';
    }
    
    if (confirm(message)) {
      returnBook(issueId);
    }
  };

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'returned') return 'bg-green-100 text-green-800';
    if (status === 'overdue') return 'bg-red-100 text-red-800';
    if (status === 'issued' && new Date(dueDate) <= new Date()) return 'bg-red-100 text-red-800';
    if (status === 'issued') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'returned') return 'Returned';
    if (status === 'overdue') return 'Overdue';
    if (status === 'issued' && new Date(dueDate) <= new Date()) return 'Overdue';
    if (status === 'issued') return 'Issued';
    return status;
  };

  const calculateFine = (issue: any) => {
    if (issue.status === 'returned') return issue.fine || 0;
    const today = new Date().toLocaleDateString('en-CA');
    if (issue.dueDate <= today && issue.status !== 'returned') {
      return 1000; // Fixed ₹1000 fine for overdue books
    }
    return 0;
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Issued Books</h1>
        <p className="text-gray-600 mt-2">Track all book issues and returns</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by book title, author, or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="issued">Issued</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {filteredIssues.map((issue) => {
              const book = books.find(b => b.id === issue.bookId);
              const student = students.find(s => s.id === issue.studentId);
              const fine = calculateFine(issue);
              const isOverdue = issue.status === 'issued' && new Date(issue.dueDate) < new Date();
              
              return (
                <div key={issue.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{book?.title}</h3>
                        <p className="text-sm text-gray-500">by {book?.author}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {issue.status === 'issued' && (
                        <button
                          onClick={() => handleReturnBook(issue.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Return Book"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Student:</span>
                      <div className="flex items-center mt-1">
                        <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <User className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <div className="text-gray-900">{student?.name}</div>
                          <div className="text-xs text-gray-500">{student?.studentId}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status, issue.dueDate)}`}>
                        {getStatusText(issue.status, issue.dueDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Issue Date:</span>
                      <div className="flex items-center mt-1 text-gray-900">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {formatDate(issue.issueDate)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <div className={`flex items-center mt-1 ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {formatDate(issue.dueDate)}
                        {isOverdue && <AlertTriangle className="w-3 h-3 ml-1 text-red-500" />}
                      </div>
                    </div>
                  </div>
                  
                  {fine > 0 && (
                    <div className="text-sm">
                      <span className="text-red-600 font-medium">Fine: ₹{fine}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Fine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const student = students.find(s => s.id === issue.studentId);
                const fine = calculateFine(issue);
                const isOverdue = issue.status === 'issued' && new Date(issue.dueDate) < new Date();
                
                return (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book?.title}</div>
                          <div className="text-sm text-gray-500">{book?.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                          <div className="text-sm text-gray-500">{student?.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(issue.issueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center text-sm ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(issue.dueDate)}
                        {isOverdue && <AlertTriangle className="w-4 h-4 ml-1 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(issue.status, issue.dueDate)}`}>
                        {getStatusText(issue.status, issue.dueDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{fine}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(issue.status === 'issued' || issue.status === 'overdue') && (
                        <button
                          onClick={() => handleReturnBook(issue.id)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Return</span>
                        </button>
                      )}
                      {issue.status === 'returned' && (
                        <span className="text-green-600 text-sm">
                          Returned on {formatDate(issue.returnDate || '')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No issued books found.</p>
          </div>
        )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{issues.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Issued</p>
              <p className="text-2xl font-bold text-gray-900">
                {issues.filter(i => i.status === 'issued').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold text-gray-900">
                {issues.filter(i => {
                  const today = new Date().toLocaleDateString('en-CA');
                  return i.status !== 'returned' && i.dueDate <= today;
                }).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fines</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{issues.reduce((total, issue) => total + calculateFine(issue), 0)}
              </p>
            </div>
            <RotateCcw className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuedBooks;