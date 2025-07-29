import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';
import { Book } from '../types';

const BookManagement: React.FC = () => {
  const { books, categories, addBook, updateBook, deleteBook, loading } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    categoryId: '',
    publisher: '',
    publishYear: new Date().getFullYear(),
    totalCopies: 1,
    description: '',
  });

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.category && book.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      categoryId: '',
      publisher: '',
      publishYear: new Date().getFullYear(),
      totalCopies: 1,
      description: '',
    });
    setEditingBook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // formData.categoryId now contains the actual category ID
      const categoryId = formData.categoryId;
    
    if (editingBook) {
        await updateBook(editingBook.id, {
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          categoryId,
          publisher: formData.publisher,
          publishYear: formData.publishYear,
          totalCopies: formData.totalCopies,
          description: formData.description,
        availableCopies: editingBook.availableCopies + (formData.totalCopies - editingBook.totalCopies),
      });
    } else {
        await addBook({
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          categoryId,
          publisher: formData.publisher,
          publishYear: formData.publishYear,
          totalCopies: formData.totalCopies,
          description: formData.description,
        availableCopies: formData.totalCopies,
      });
    }
    
    setShowModal(false);
    resetForm();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Error saving book. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      categoryId: book.categoryId || '',
      publisher: book.publisher || '',
      publishYear: book.publishYear,
      totalCopies: book.totalCopies,
      description: book.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Book Management</h1>
          <p className="text-gray-600 mt-2">Manage your library's book collection</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Book</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books by title, author, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          {filteredBooks.length > 0 ? (
            <div className="p-4 space-y-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-500">by {book.author}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-1 inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {book.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">ISBN:</span>
                      <span className="ml-1 text-gray-900">{book.isbn}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Copies:</span>
                      <span className="ml-1 text-gray-900">{book.totalCopies}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Available:</span>
                      <span className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        book.availableCopies > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availableCopies}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {book.publisher} ({book.publishYear})
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Books Found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first book to the library collection.</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Book</span>
              </button>
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          {filteredBooks.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Copies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">{book.publisher} ({book.publishYear})</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.isbn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.totalCopies}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        book.availableCopies > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Books Found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first book to the library collection.</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Book</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 lg:p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
            <div className="p-4 lg:p-6 border-b border-gray-100">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publisher</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publish Year</label>
                  <input
                    type="number"
                    value={formData.publishYear}
                    onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalCopies}
                    onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;