import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { BookOpen, User, Calendar, CheckCircle } from 'lucide-react';

const BooksReturned: React.FC = () => {
  const { books, students, issues } = useLibrary();

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

  // Filter returned books
  const returnedIssues = issues.filter(issue => issue.status === 'returned');

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Books Returned</h1>
        <p className="text-gray-600 mt-2">List of all returned books</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {returnedIssues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p>No returned books found.</p>
              </div>
            ) : (
              returnedIssues.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const student = students.find(s => s.id === issue.studentId);
                return (
                  <div key={issue.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-green-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{book?.title}</h3>
                        <p className="text-sm text-gray-500">by {book?.author}</p>
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
                        <span className="text-gray-500">Fine:</span>
                        <div className="mt-1">
                          {issue.fine > 0 ? (
                            <span className="text-red-600 font-semibold">₹{issue.fine}</span>
                          ) : (
                            <span className="text-green-600">No Fine</span>
                          )}
                        </div>
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
                        <div className="flex items-center mt-1 text-gray-900">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {formatDate(issue.dueDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-green-600 font-semibold">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        Returned: {formatDate(issue.returnDate || '')}
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
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Fine</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returnedIssues.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    No returned books found.
                  </td>
                </tr>
              )}
              {returnedIssues.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const student = students.find(s => s.id === issue.studentId);
                return (
                  <tr key={issue.id} className="hover:bg-green-50 transition-colors">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400 inline" />
                      {formatDate(issue.issueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400 inline" />
                      {formatDate(issue.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500 inline" />
                      {formatDate(issue.returnDate || '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.fine > 0 ? (
                        <span className="text-red-600 font-semibold">₹{issue.fine}</span>
                      ) : (
                        <span className="text-green-600">No Fine</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returned</p>
              <p className="text-2xl font-bold text-gray-900">{returnedIssues.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Books with Fines</p>
              <p className="text-2xl font-bold text-gray-900">
                {returnedIssues.filter(i => i.fine > 0).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fines Collected</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{returnedIssues.reduce((total, issue) => total + (issue.fine || 0), 0)}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksReturned; 