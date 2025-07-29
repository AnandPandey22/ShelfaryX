import React, { useMemo, useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { BookOpen, Users, ClipboardList, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const { books, students, issues } = useLibrary();
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [showAllStudents, setShowAllStudents] = useState(false);

  // Summary stats
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const totalUsers = students.length;
  const totalIssues = issues.length;
  const totalReturned = issues.filter(i => i.status === 'returned').length;
  const today = new Date().toLocaleDateString('en-CA'); // Use local date
  const totalOverdue = issues.filter(i => (i.status === 'issued' || i.status === 'overdue') && i.dueDate <= today).length;
  const totalFines = useMemo(() => {
    return issues.reduce((total, issue) => {
      if (issue.status === 'returned') return total + (issue.fine || 0);
      if ((issue.status === 'issued' || issue.status === 'overdue') && issue.dueDate <= today) {
        return total + 1000; // Fixed ₹1000 fine
      }
      return total;
    }, 0);
  }, [issues, today]);

  // Top 5 most issued books
  const bookIssueCounts = books.map(book => ({
    ...book,
    issuedCount: issues.filter(i => i.bookId === book.id).length
  }));
  const topBooks = [...bookIssueCounts].sort((a, b) => b.issuedCount - a.issuedCount);

  // Top 5 most active students
  const studentIssueCounts = students.map(student => ({
    ...student,
    issueCount: issues.filter(i => i.studentId === student.id).length
  }));
  const topStudents = [...studentIssueCounts].sort((a, b) => b.issueCount - a.issueCount);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Library usage statistics and insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center space-x-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Total Books</p>
            <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center space-x-4">
          <Users className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center space-x-4">
          <ClipboardList className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Total Issues</p>
            <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center space-x-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
          <div>
            <p className="text-sm text-gray-600">Books Returned</p>
            <p className="text-2xl font-bold text-gray-900">{totalReturned}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center space-x-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <div>
            <p className="text-sm text-gray-600">Overdue Books</p>
            <p className="text-2xl font-bold text-gray-900">{totalOverdue}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center space-x-4">
          <DollarSign className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm text-gray-600">Total Fines Collected</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalFines}</p>
          </div>
        </div>
      </div>

      {/* Top Books */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top {showAllBooks ? topBooks.length : 5} Most Issued Books</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Times Issued</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(showAllBooks ? topBooks : topBooks.slice(0, 5)).map(book => (
              <tr key={book.id} className="hover:bg-indigo-50 transition-colors">
                <td className="px-4 py-2 font-medium text-gray-900">{book.title}</td>
                <td className="px-4 py-2 text-gray-600">{book.author}</td>
                <td className="px-4 py-2 text-center text-indigo-700 font-bold">{book.issuedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {topBooks.length > 5 && (
          <button
            className="mt-3 text-indigo-600 hover:underline text-sm"
            onClick={() => setShowAllBooks(v => !v)}
          >
            {showAllBooks ? 'Show Top 5' : `Show All (${topBooks.length})`}
          </button>
        )}
      </div>

      {/* Top Students */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top {showAllStudents ? topStudents.length : 5} Most Active Students</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Books Issued</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(showAllStudents ? topStudents : topStudents.slice(0, 5)).map(student => (
              <tr key={student.id} className="hover:bg-green-50 transition-colors">
                <td className="px-4 py-2 font-medium text-gray-900">{student.name}</td>
                <td className="px-4 py-2 text-gray-600">{student.studentId}</td>
                <td className="px-4 py-2 text-center text-green-700 font-bold">{student.issueCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {topStudents.length > 5 && (
          <button
            className="mt-3 text-green-600 hover:underline text-sm"
            onClick={() => setShowAllStudents(v => !v)}
          >
            {showAllStudents ? 'Show Top 5' : `Show All (${topStudents.length})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default Reports; 