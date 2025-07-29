import React from 'react';
import { BookOpen, Users, ClipboardList, AlertTriangle } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';

const Dashboard: React.FC = () => {
  const { books, users, issues, getOverdueBooks } = useLibrary();
  
  const overdueIssues = getOverdueBooks();
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const issuedBooks = issues.filter(issue => issue.status === 'issued' || issue.status === 'overdue').length;

  const stats = [
    {
      title: 'Total Books',
      value: totalBooks,
      icon: BookOpen,
      color: 'blue',
      description: `${availableBooks} available`,
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'green',
      description: `${users.filter(u => u.isActive).length} active`,
    },
    {
      title: 'Books Issued',
      value: issuedBooks,
      icon: ClipboardList,
      color: 'purple',
      description: 'Currently out',
    },
    {
      title: 'Overdue Books',
      value: overdueIssues.length,
      icon: AlertTriangle,
      color: 'red',
      description: 'Need attention',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your library system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const [bgColor, textColor, cardBg] = colorClasses[stat.color as keyof typeof colorClasses].split(' ');
          
          return (
            <div key={index} className={`${cardBg} rounded-xl p-6 border border-gray-100`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 ${bgColor} rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Issues</h2>
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => {
              const book = books.find(b => b.id === issue.bookId);
              const user = users.find(u => u.id === issue.userId);
              
              return (
                <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{book?.title}</p>
                    <p className="text-sm text-gray-600">{user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Due: {issue.dueDate}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      issue.status === 'overdue' 
                        ? 'bg-red-100 text-red-800'
                        : issue.status === 'issued'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Books</h2>
          <div className="space-y-3">
            {books
              .sort((a, b) => (b.totalCopies - b.availableCopies) - (a.totalCopies - a.availableCopies))
              .slice(0, 5)
              .map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {book.totalCopies - book.availableCopies} issued
                    </p>
                    <p className="text-xs text-gray-500">
                      {book.availableCopies} available
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;