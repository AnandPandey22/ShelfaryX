import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Phone, MapPin, GraduationCap } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';
import { Student } from '../types';

const StudentManagement: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, loading } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    class: '',
    section: '',
    mobileNumber: '',
    address: '',
    collegeBranch: '',
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.collegeBranch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      studentId: '',
      class: '',
      section: '',
      mobileNumber: '',
      address: '',
      collegeBranch: '',
    });
    setEditingStudent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
      } else {
        await addStudent({
          ...formData,
          // Set default values for required fields that are not in the manual form
          email: `${formData.studentId.toLowerCase()}@college.edu`, // Generate email from student ID
          password: 'password123', // Default password
          class: formData.class, // Use class from form
          course: formData.class, // Use class as course
          college: 'College', // Default college
          branch: formData.collegeBranch, // Use college branch as branch
          joinDate: new Date().toLocaleDateString('en-CA'), // Use local date in YYYY-MM-DD format
          isActive: true,
        });
      }
    
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      studentId: student.studentId,
      class: student.class,
      section: student.section,
      mobileNumber: student.mobileNumber,
      address: student.address,
      collegeBranch: student.collegeBranch,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
      }
    }
  };

  const toggleStudentStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateStudent(id, { isActive: !currentStatus });
    } catch (error) {
      console.error('Error updating student status:', error);
      alert('Error updating student status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-2">Manage student registrations and information</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name, ID, class, section, or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          {filteredStudents.length > 0 ? (
            <div className="p-4 space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Class:</span>
                      <span className="ml-1 text-gray-900">{student.class}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Section:</span>
                      <span className="ml-1 text-gray-900">{student.section}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Branch:</span>
                      <span className="ml-1 inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {student.collegeBranch}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        student.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-900">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {student.mobileNumber}
                    </div>
                    <div className="flex items-start text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{student.address}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Joined: {student.joinDate}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first student to the library system.</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Student</span>
              </button>
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
          {filteredStudents.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Class & Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.class} - {student.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {student.collegeBranch}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.mobileNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        student.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
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
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first student to the library system.</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Student</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID *</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., CS2021001"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., B.Tech, M.Tech"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., CSE-A, ECE-B"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1234567890"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Branch *</label>
                  <select
                    value={formData.collegeBranch}
                    onChange={(e) => setFormData({ ...formData, collegeBranch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Biotechnology">Biotechnology</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter complete address"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;