import React, { useState } from 'react';
import { Search, Building2, Mail, Phone, Globe, Calendar, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Institution } from '../../types';
import InstitutionModal from './InstitutionModal';

interface AdminInstitutionsProps {
  institutions: Institution[];
  onRefresh?: () => void;
}

const AdminInstitutions: React.FC<AdminInstitutionsProps> = ({ institutions, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [institutionsList, setInstitutionsList] = useState<Institution[]>(institutions);

  const filteredInstitutions = institutionsList.filter(institution =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.collegeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInstitution = () => {
    setSelectedInstitution(null);
    setIsModalOpen(true);
  };

  const handleEditInstitution = (institution: Institution) => {
    setSelectedInstitution(institution);
    setIsModalOpen(true);
  };

  const handleSaveInstitution = () => {
    // Refresh the data by updating the local state
    setInstitutionsList([...institutions]);
    // Call the parent refresh function if provided
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Institutions</h2>
          <p className="text-gray-600">Manage and view all registered institutions</p>
        </div>
        <button
          onClick={handleAddInstitution}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Institution</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search institutions by name, code, or email..."
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
            <Building2 className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Institutions</p>
              <p className="text-2xl font-bold text-blue-900">{institutions.length}</p>
            </div>
          </div>
        </div>
                  <div className="bg-green-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">
                {institutions.filter(i => i.isActive).length}
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
                {institutions.filter(i => !i.isActive).length}
              </p>
            </div>
          </div>
        </div>
                  <div className="bg-purple-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">This Month</p>
              <p className="text-2xl font-bold text-purple-900">
                {institutions.filter(i => {
                  const createdDate = new Date(i.createdAt);
                  const now = new Date();
                  return createdDate.getMonth() === now.getMonth() && 
                         createdDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Institutions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {filteredInstitutions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <Building2 className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-400">No institutions found</p>
                  <p className="text-sm text-gray-400">No institutions match your search criteria</p>
                </div>
              </div>
            ) : (
              filteredInstitutions.map((institution) => (
                <div key={institution.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{institution.name}</h3>
                        <p className="text-sm text-gray-500">Code: {institution.collegeCode}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditInstitution(institution)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          institution.isActive
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {institution.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Joined:</span>
                      <div className="mt-1 text-gray-900">
                        {new Date(institution.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {institution.email}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {institution.phone}
                    </div>
                    {institution.address && (
                      <div className="flex items-start text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{institution.address}</span>
                      </div>
                    )}
                    {institution.website && (
                      <div className="flex items-center text-blue-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <a href={institution.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm">
                          Website
                        </a>
                      </div>
                    )}
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
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstitutions.map((institution) => (
                <tr key={institution.id} className="hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{institution.name}</div>
                      <div className="text-sm text-gray-500">Code: {institution.collegeCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {institution.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {institution.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {institution.address && (
                        <div className="text-sm text-gray-900">{institution.address}</div>
                      )}
                      {institution.website && (
                        <div className="flex items-center text-sm text-blue-600">
                          <Globe className="w-4 h-4 mr-1" />
                          <a href={institution.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      institution.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {institution.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {new Date(institution.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditInstitution(institution)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Institution"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InstitutionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        institution={selectedInstitution}
        onSave={handleSaveInstitution}
      />

      {filteredInstitutions.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No institutions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No institutions have been registered yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminInstitutions; 