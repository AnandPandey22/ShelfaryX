import React, { useEffect, useState } from 'react';
import { BookOpen, Users, ClipboardList, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';

const Dashboard: React.FC = () => {
  const { books, students, issues, getOverdueBooks, loading } = useLibrary();
  const [overdueCount, setOverdueCount] = useState(0);
  
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

  // Calculate overdue books and update status
  const calculateOverdueBooks = () => {
    // Call getOverdueBooks to update status in context
  const overdueIssues = getOverdueBooks();
    console.log('Dashboard - Overdue issues:', overdueIssues);
    console.log('Dashboard - Overdue count:', overdueIssues.length);
    return overdueIssues.length;
  };

  // Update overdue count when issues change
  useEffect(() => {
    const count = calculateOverdueBooks();
    console.log('Dashboard - Setting overdue count to:', count);
    setOverdueCount(count);
  }, [issues]);

  // Refresh overdue status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const count = calculateOverdueBooks();
      setOverdueCount(count);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [issues]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const issuedBooks = issues.filter(issue => issue.status === 'issued' || issue.status === 'overdue').length;
  const returnedBooks = issues.filter(issue => issue.status === 'returned').length;
  const totalBooksIssued = issues.length;

  const stats = [
    {
      title: 'Total Books',
      value: totalBooks,
      icon: BookOpen,
      color: 'blue',
      description: `${availableBooks} available`,
    },
    {
      title: 'Registered Students',
      value: students.length,
      icon: Users,
      color: 'green',
      description: `${students.filter(s => s.isActive).length} active`,
    },
    {
      title: 'Books Issued',
      value: issuedBooks,
      icon: ClipboardList,
      color: 'purple',
      description: 'Currently out',
    },
    {
      title: 'Books Returned',
      value: returnedBooks,
      icon: CheckCircle,
      color: 'emerald',
      description: 'Returned to library',
    },
    {
      title: 'Overdue Books',
      value: overdueCount,
      icon: AlertTriangle,
      color: 'red',
      description: 'Need attention',
    },
    {
      title: 'Total Books Issued',
      value: totalBooksIssued,
      icon: BarChart2,
      color: 'yellow',
      description: 'All-time issued',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    emerald: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your library system</p>
      </div>

      {/* 2 rows x 3 columns for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.slice(0, 3).map((stat, index) => {
          const Icon = stat.icon;
          const [bgColor, textColor, cardBg] = colorClasses[stat.color as keyof typeof colorClasses].split(' ');
          return (
            <div
              key={index}
              className={`${cardBg} rounded-xl p-6 border border-gray-100 transition-transform transition-shadow duration-200 hover:shadow-xl hover:scale-[1.03] cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 ${bgColor} rounded-lg transition-transform duration-200 hover:scale-110`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.slice(3, 6).map((stat, index) => {
          const Icon = stat.icon;
          const [bgColor, textColor, cardBg] = colorClasses[stat.color as keyof typeof colorClasses].split(' ');
          return (
            <div
              key={index}
              className={`${cardBg} rounded-xl p-6 border border-gray-100 transition-transform transition-shadow duration-200 hover:shadow-xl hover:scale-[1.03] cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 ${bgColor} rounded-lg transition-transform duration-200 hover:scale-110`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => {
              const book = books.find(b => b.id === issue.bookId);
              const student = students.find(s => s.id === issue.studentId);
              
              return (
                <div
                  key={issue.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-shadow transition-transform duration-200 hover:shadow-md hover:bg-indigo-50 hover:scale-[1.01] cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900 transition-colors duration-200 hover:text-indigo-700">{book?.title}</p>
                    <p className="text-sm text-gray-600 transition-colors duration-200 hover:text-indigo-600">{student?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Due: {formatDate(issue.dueDate)}</p>
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
                <div
                  key={book.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-shadow transition-transform duration-200 hover:shadow-md hover:bg-indigo-50 hover:scale-[1.01] cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900 transition-colors duration-200 hover:text-indigo-700">{book.title}</p>
                    <p className="text-sm text-gray-600 transition-colors duration-200 hover:text-indigo-600">{book.author}</p>
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