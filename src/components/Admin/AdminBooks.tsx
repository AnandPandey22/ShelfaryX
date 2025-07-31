import React, { useState } from 'react';
import { Search, BookOpen, User, Calendar, Building2, Hash } from 'lucide-react';
import { Book, Institution, PrivateLibrary } from '../../types';

interface AdminBooksProps {
  books: Book[];
  institutions: Institution[];
  privateLibraries: PrivateLibrary[];
}

const AdminBooks: React.FC<AdminBooksProps> = ({ books, institutions, privateLibraries }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInstitutionName = (institutionId: string) => {
    // Try exact match first
    let institution = institutions.find(i => i.id === institutionId);
    if (institution) return institution.name;
    
    let library = privateLibraries.find(l => l.id === institutionId);
    if (library) return library.name;
    
    // Try string comparison (in case of type mismatch)
    institution = institutions.find(i => String(i.id) === String(institutionId));
    if (institution) return institution.name;
    
    library = privateLibraries.find(l => String(l.id) === String(institutionId));
    if (library) return library.name;
    
    return 'Unknown';
  };

  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const issuedBooks = totalBooks - availableBooks;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Books</h2>
        <p className="text-gray-600">View and manage books across all institutions</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books by title, author, ISBN, publisher, or category..."
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
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Books</p>
              <p className="text-2xl font-bold text-blue-900">{totalBooks.toLocaleString()}</p>
            </div>
          </div>
        </div>
                  <div className="bg-green-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Available</p>
              <p className="text-2xl font-bold text-green-900">{availableBooks.toLocaleString()}</p>
            </div>
          </div>
        </div>
                  <div className="bg-orange-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">Issued</p>
              <p className="text-2xl font-bold text-orange-900">{issuedBooks.toLocaleString()}</p>
            </div>
          </div>
        </div>
                  <div className="bg-purple-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Hash className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Unique Titles</p>
              <p className="text-2xl font-bold text-purple-900">{books.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <BookOpen className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-400">No books found</p>
                  <p className="text-sm text-gray-400">No books match your search criteria</p>
                </div>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div key={book.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-500">by {book.author}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Institution:</span>
                      <div className="flex items-center mt-1">
                        <Building2 className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="text-gray-900">{getInstitutionName(book.institutionId)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <div className="mt-1">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {book.category || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">ISBN:</span>
                      <div className="mt-1 text-gray-900">{book.isbn}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Publisher:</span>
                      <div className="mt-1 text-gray-900">{book.publisher}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Availability:</span>
                      <span className="text-gray-900 font-medium">
                        {book.availableCopies} of {book.totalCopies} available
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {Math.round((book.availableCopies / book.totalCopies) * 100)}% available
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Published: {book.publishYear}
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
                  Book Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Publisher
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        {book.author}
                      </div>
                      <div className="text-sm text-gray-500">ISBN: {book.isbn}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-900">{getInstitutionName(book.institutionId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {book.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        {book.availableCopies} of {book.totalCopies} available
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((book.availableCopies / book.totalCopies) * 100)}% available
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{book.publisher}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {book.publishYear}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No books have been added yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminBooks; 