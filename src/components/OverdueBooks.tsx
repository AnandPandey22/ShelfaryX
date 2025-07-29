import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { BookOpen, User, Calendar, AlertTriangle, RotateCcw } from 'lucide-react';

const OverdueBooks: React.FC = () => {
  const { books, students, issues, returnBook } = useLibrary();

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

  // Find overdue issues
  const today = new Date().toLocaleDateString('en-CA'); // Use local date
  const overdueIssues = issues.filter(issue => {
    return issue.status !== 'returned' && issue.dueDate <= today;
  });

  // Calculate days overdue and fine
  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.max(0, Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
  };
  const getFine = (dueDate: string) => {
    const today = new Date().toLocaleDateString('en-CA');
    return dueDate <= today ? 1000 : 0; // Fixed ₹1000 fine for overdue books
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Overdue Books</h1>
        <p className="text-gray-600 mt-2">List of all overdue book issues</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {overdueIssues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                <p>No overdue books found.</p>
              </div>
            ) : (
              overdueIssues.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const student = students.find(s => s.id === issue.studentId);
                const daysOverdue = getDaysOverdue(issue.dueDate);
                const fine = getFine(issue.dueDate);
                return (
                  <div key={issue.id} className="border border-red-200 rounded-lg p-4 space-y-3 bg-red-50">
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
                        <button
                          onClick={() => {
                            if (confirm('This book is overdue. A fine of ₹1000 will be applied. Are you sure you want to return it?')) {
                              returnBook(issue.id);
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Return Book"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
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
                        <span className="text-gray-500">Days Overdue:</span>
                        <div className="mt-1 text-red-600 font-semibold">
                          {daysOverdue} days
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
                        <div className="flex items-center mt-1 text-red-600">
                          <Calendar className="w-3 h-3 mr-1 text-red-400" />
                          {formatDate(issue.dueDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-red-600 font-semibold">Fine: ₹{fine}</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Days Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Fine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overdueIssues.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                    No overdue books found.
                  </td>
                </tr>
              )}
              {overdueIssues.map((issue) => {
                const book = books.find(b => b.id === issue.bookId);
                const student = students.find(s => s.id === issue.studentId);
                const daysOverdue = getDaysOverdue(issue.dueDate);
                const fine = getFine(issue.dueDate);
                return (
                  <tr key={issue.id} className="hover:bg-red-50 transition-colors">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400 inline" />
                      {formatDate(issue.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-red-700 font-bold">
                      {daysOverdue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-red-700 font-bold">
                      ₹{fine}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => returnBook(issue.id)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1 px-3 py-1 rounded hover:bg-indigo-50 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Return</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverdueBooks; 