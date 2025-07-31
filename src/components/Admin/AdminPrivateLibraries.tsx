import React, { useState } from 'react';
import { Search, Building2, Mail, Phone, Globe, Calendar, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { PrivateLibrary } from '../../types';
import PrivateLibraryModal from './PrivateLibraryModal';

interface AdminPrivateLibrariesProps {
  privateLibraries: PrivateLibrary[];
  onRefresh?: () => void;
}

const AdminPrivateLibraries: React.FC<AdminPrivateLibrariesProps> = ({ privateLibraries, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<PrivateLibrary | null>(null);
  const [librariesList, setLibrariesList] = useState<PrivateLibrary[]>(privateLibraries);

  const filteredLibraries = librariesList.filter(library =>
    library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    library.libraryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    library.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLibrary = () => {
    setSelectedLibrary(null);
    setIsModalOpen(true);
  };

  const handleEditLibrary = (library: PrivateLibrary) => {
    setSelectedLibrary(library);
    setIsModalOpen(true);
  };

  const handleSaveLibrary = () => {
    // Refresh the data by updating the local state
    setLibrariesList([...privateLibraries]);
    // Call the parent refresh function if provided
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Private Libraries</h2>
          <p className="text-gray-600">Manage and view all registered private libraries</p>
        </div>
        <button
          onClick={handleAddLibrary}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Library</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search libraries by name, code, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Total Libraries</p>
              <p className="text-2xl font-bold text-purple-900">{privateLibraries.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">
                {privateLibraries.filter(l => l.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Inactive</p>
              <p className="text-2xl font-bold text-yellow-900">
                {privateLibraries.filter(l => !l.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">This Month</p>
              <p className="text-2xl font-bold text-blue-900">
                {privateLibraries.filter(l => {
                  const createdAt = new Date(l.createdAt);
                  const now = new Date();
                  return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Libraries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Library
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLibraries.map((library) => (
                <tr key={library.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{library.name}</div>
                        <div className="text-sm text-gray-500">{library.libraryCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{library.email}</div>
                    <div className="text-sm text-gray-500">{library.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{library.address || 'N/A'}</div>
                    {library.website && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        {library.website}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      library.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {library.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(library.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditLibrary(library)}
                      className="text-purple-600 hover:text-purple-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredLibraries.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No libraries found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first private library.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <PrivateLibraryModal
          library={selectedLibrary}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveLibrary}
        />
      )}
    </div>
  );
};

export default AdminPrivateLibraries; 