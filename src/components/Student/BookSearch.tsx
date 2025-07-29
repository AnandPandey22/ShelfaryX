import React, { useState } from 'react';
import { Search, BookOpen, User, Calendar, CheckCircle } from 'lucide-react';
import { useLibrary } from '../../contexts/LibraryContext';
import { useAuth } from '../../contexts/AuthContext';

const BookSearch: React.FC = () => {
  const { books, searchBooks, issueBook } = useLibrary();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const searchResults = searchTerm ? searchBooks(searchTerm) : books;
  const categories = [...new Set(books.map(book => book.category))];
  
  const filteredResults = selectedCategory 
    ? searchResults.filter(book => book.category === selectedCategory)
    : searchResults;

  const handleIssueBook = (bookId: string) => {
    if (currentUser) {
      issueBook(bookId, currentUser.id);
      alert('Book issued successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search Books</h1>
        <p className="text-gray-600 mt-2">Find and request books from our collection</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <User className="w-4 h-4 mr-1" />
                  {book.author}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  {book.publishYear} • {book.publisher}
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {book.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    book.availableCopies > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.availableCopies > 0 
                      ? `${book.availableCopies} available` 
                      : 'Not available'
                    }
                  </span>
                </div>
                
                <button
                  onClick={() => handleIssueBook(book.id)}
                  disabled={book.availableCopies === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    book.availableCopies > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {book.availableCopies > 0 ? 'Issue Book' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse all books.</p>
        </div>
      )}
    </div>
  );
};

export default BookSearch;