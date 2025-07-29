import React from 'react';
import { BookOpen, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const MyBooks: React.FC = () => {
  const { books, issues } = useLibrary();

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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Book Issues</h1>
        <p className="text-gray-600 mt-2">View all book issues in the library system</p>
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No books have been issued yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
            <div className="p-6 space-y-4">
              {issues.map((issue) => {
            const book = books.find(b => b.id === issue.bookId);
            const isOverdue = issue.status === 'issued' && new Date(issue.dueDate) < new Date();
            const daysOverdue = isOverdue 
              ? Math.floor((new Date().getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24))
              : 0;

            return (
              <div key={issue.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{book?.title}</h3>
                        <p className="text-sm text-gray-600">by {book?.author}</p>
                      </div>
                    </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                        Issued: {formatDate(issue.issueDate)}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                        Due: {formatDate(issue.dueDate)}
                        </div>
                        {issue.returnDate && (
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                          Returned: {formatDate(issue.returnDate)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          isOverdue ? 'overdue' : issue.status
                        )}`}>
                          {isOverdue ? 'Overdue' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </span>
                        
                        {isOverdue && (
                          <div className="flex items-center text-red-600 text-sm">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            {daysOverdue} days overdue
                          </div>
                        )}
                        
                        {(issue.fine > 0 || isOverdue) && (
                          <span className="text-sm font-medium text-red-600">
                          Fine: ₹{isOverdue ? 1000 : issue.fine}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Books Issued</p>
              <p className="text-2xl font-bold text-gray-900">
                {issues.filter(i => i.status === 'issued').length}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Books Returned</p>
              <p className="text-2xl font-bold text-gray-900">
                {issues.filter(i => i.status === 'returned').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fine</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {issues.reduce((total, issue) => {
                  if (issue.status === 'issued' && new Date(issue.dueDate) < new Date()) {
                    return total + 1000; // Fixed ₹1000 fine
                  }
                  return total + issue.fine;
                }, 0)}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooks;