import React, { useState } from 'react';
import { Search, Users, Mail, Phone, MapPin, Calendar, Building2, Plus, Edit, Trash2 } from 'lucide-react';
import { Student, Institution } from '../../types';
import StudentModal from './StudentModal';

interface AdminStudentsProps {
  students: Student[];
  institutions: Institution[];
  onRefresh?: () => void;
}

const AdminStudents: React.FC<AdminStudentsProps> = ({ students, institutions, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentsList, setStudentsList] = useState<Student[]>(students);

  const filteredStudents = studentsList.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = () => {
    // Refresh the data by updating the local state
    setStudentsList([...students]);
    // Call the parent refresh function if provided
    if (onRefresh) {
      onRefresh();
    }
  };

  const getInstitutionName = (institutionId: string) => {
    const institution = institutions.find(i => i.id === institutionId);
    return institution?.name || 'Unknown Institution';
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Students</h2>
          <p className="text-gray-600">View and manage students across all institutions</p>
        </div>
        <button
          onClick={handleAddStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name, ID, email, course, or college..."
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
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-900">{students.length}</p>
            </div>
          </div>
        </div>
                  <div className="bg-green-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900">
                {students.filter(s => s.isActive).length}
              </p>
            </div>
          </div>
        </div>
                  <div className="bg-yellow-50 p-4 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Inactive</p>
              <p className="text-2xl font-bold text-yellow-900">
                {students.filter(s => !s.isActive).length}
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
                {students.filter(s => {
                  const joinDate = new Date(s.joinDate);
                  const now = new Date();
                  return joinDate.getMonth() === now.getMonth() && 
                         joinDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-hide">
          <div className="p-4 space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-400">No students found</p>
                  <p className="text-sm text-gray-400">No students match your search criteria</p>
                </div>
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Institution:</span>
                      <div className="flex items-center mt-1">
                        <Building2 className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="text-gray-900">{getInstitutionName(student.institutionId)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          student.isActive
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Course:</span>
                      <div className="mt-1 text-gray-900">{student.course}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Class:</span>
                      <div className="mt-1 text-gray-900">{student.class} • {student.section}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {student.email}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {student.mobileNumber}
                    </div>
                    {student.address && (
                      <div className="flex items-start text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{student.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Joined: {new Date(student.joinDate).toLocaleDateString()}
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
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Course Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Contact
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-900">{getInstitutionName(student.institutionId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{student.course}</div>
                      <div className="text-sm text-gray-500">
                        {student.class} • {student.section}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {student.mobileNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {new Date(student.joinDate).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Student"
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

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        institutions={institutions}
        onSave={handleSaveStudent}
      />

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No students have been registered yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminStudents; 