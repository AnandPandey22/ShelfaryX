import React, { useState } from 'react';
import { Search, ClipboardList, BookOpen, Users, Building2, Calendar, AlertTriangle } from 'lucide-react';
import { BookIssue, Book, Student, Institution } from '../../types';

interface AdminIssuesProps {
  issues: BookIssue[];
  books: Book[];
  students: Student[];
  institutions: Institution[];
}

const AdminIssues: React.FC<AdminIssuesProps> = ({ issues, books, students, institutions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = issues.filter(issue => {
    const book = books.find(b => b.id === issue.bookId);
    const student = students.find(s => s.id === issue.studentId);
    const institution = institutions.find(i => i.id === issue.institutionId);
    
    return (
      book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book?.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book?.title || 'Unknown Book';
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getStudentId = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.studentId || 'Unknown ID';
  };

  const getInstitutionName = (institutionId: string) => {
    const institution = institutions.find(i => i.id === institutionId);
    return institution?.name || 'Unknown Institution';
  };

  const totalIssues = issues.length;
  const issuedBooks = issues.filter(issue => issue.status === 'issued').length;
  const returnedBooks = issues.filter(issue => issue.status === 'returned').length;
  const overdueBooks = issues.filter(issue => issue.status === 'overdue').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Book Issues</h2>
        <p className="text-gray-600">View and manage book issues across all institutions</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by book title, author, student name, institution, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Issues</p>
              <p className="text-2xl font-bold text-blue-900">{totalIssues.toLocaleString()}</p>
            </div>
          </div>
        </div>
                  <div className="bg-orange-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">Currently Issued</p>
              <p className="text-2xl font-bold text-orange-900">{issuedBooks.toLocaleString()}</p>
            </div>
          </div>
        </div>
                  <div className="bg-green-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Returned</p>
              <p className="text-2xl font-bold text-green-900">{returnedBooks.toLocaleString()}</p>
            </div>
          </div>
        </div>
                  <div className="bg-red-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{overdueBooks.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <ClipboardList className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-400">No issues found</p>
                  <p className="text-sm text-gray-400">No issues match your search criteria</p>
                </div>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div key={issue.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{getBookTitle(issue.bookId)}</h3>
                        <p className="text-sm text-gray-500">by {getStudentName(issue.studentId)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Institution:</span>
                      <div className="flex items-center mt-1">
                        <Building2 className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="text-gray-900">{getInstitutionName(issue.institutionId)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className="mt-1">
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
                    <div>
                      <span className="text-gray-500">Issue Date:</span>
                      <div className="mt-1 text-gray-900">{issue.issueDate}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <div className="mt-1 text-gray-900">{issue.dueDate}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {issue.returnDate && (
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Returned: {issue.returnDate}
                      </div>
                    )}
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      Issued by: {issue.issuedBy}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Fine:</span>
                      <span className={issue.fine > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                        {issue.fine > 0 ? `₹${issue.fine}` : 'No fine'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-hide">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Book & Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Issue Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Fine
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                        {getBookTitle(issue.bookId)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Users className="w-4 h-4 mr-2 text-green-500" />
                        {getStudentName(issue.studentId)} ({getStudentId(issue.studentId)})
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-900">{getInstitutionName(issue.institutionId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Issued: {issue.issueDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Due: {issue.dueDate}
                      </div>
                      {issue.returnDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Returned: {issue.returnDate}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Issued by: {issue.issuedBy}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      issue.status === 'overdue' 
                        ? 'bg-red-100 text-red-800'
                        : issue.status === 'issued'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {issue.fine > 0 ? (
                        <span className="text-red-600 font-medium">₹{issue.fine}</span>
                      ) : (
                        <span className="text-green-600">No fine</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No book issues have been recorded yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminIssues; 