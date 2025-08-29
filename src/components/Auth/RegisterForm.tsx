import React, { useState, useEffect } from 'react';
import { Library, Eye, EyeOff, ArrowLeft, Building, GraduationCap, BookOpen } from 'lucide-react';
import { institutionService, studentService, privateLibraryService } from '../../services/database';

interface RegisterFormProps {
  onBackClick?: () => void;
}

interface InstitutionFormProps {
  institutionData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    collegeCode: string;
  };
  setInstitutionData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    password: string;
    phone: string;
    collegeCode: string;
  }>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

interface PrivateLibraryFormProps {
  libraryData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  setLibraryData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    password: string;
    phone: string;
  }>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

interface StudentFormProps {
  studentData: {
    name: string;
    email: string;
    password: string;
    studentId: string;
    course: string;
    branch: string;
    college: string;
    mobileNumber: string;
    address: string;
  };
  setStudentData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    password: string;
    studentId: string;
    course: string;
    branch: string;
    college: string;
    mobileNumber: string;
    address: string;
  }>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  // College/Library search props
  collegeSearch: string;
  setCollegeSearch: React.Dispatch<React.SetStateAction<string>>;
  collegeResults: Array<{id: string, name: string, collegeCode: string, type: string}>;
  showCollegeResults: boolean;
  selectedCollegeId: string;
  collegeSearchError: string;
  onCollegeSearch: (value: string) => void;
  onCollegeSelect: (college: {id: string, name: string, collegeCode: string, type: string}) => void;
}

const InstitutionForm: React.FC<InstitutionFormProps> = ({
  institutionData,
  setInstitutionData,
  showPassword,
  setShowPassword,
  loading,
  onSubmit
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
          Institution Name *
        </label>
        <input
          id="institutionName"
          type="text"
          value={institutionData.name}
          onChange={(e) => setInstitutionData({...institutionData, name: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter institution name"
          required
        />
      </div>

      <div>
        <label htmlFor="collegeCode" className="block text-sm font-medium text-gray-700 mb-2">
          College Code *
        </label>
        <input
          id="collegeCode"
          type="text"
          value={institutionData.collegeCode}
          onChange={(e) => setInstitutionData({...institutionData, collegeCode: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter unique college code"
          required
        />
      </div>
    </div>

    <div>
      <label htmlFor="institutionEmail" className="block text-sm font-medium text-gray-700 mb-2">
        Email Address *
      </label>
      <input
        id="institutionEmail"
        type="email"
        value={institutionData.email}
        onChange={(e) => setInstitutionData({...institutionData, email: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter email address"
        required
      />
    </div>

    <div>
      <label htmlFor="institutionPhone" className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number *
      </label>
      <input
        id="institutionPhone"
        type="tel"
        value={institutionData.phone}
        onChange={(e) => setInstitutionData({...institutionData, phone: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter phone number"
        required
      />
    </div>

    <div>
      <label htmlFor="institutionPassword" className="block text-sm font-medium text-gray-700 mb-2">
        Password *
      </label>
      <div className="relative">
        <input
          id="institutionPassword"
          type={showPassword ? 'text' : 'password'}
          value={institutionData.password}
          onChange={(e) => setInstitutionData({...institutionData, password: e.target.value})}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Registering...' : 'Register Institution'}
    </button>
  </form>
);

const PrivateLibraryForm: React.FC<PrivateLibraryFormProps> = ({
  libraryData,
  setLibraryData,
  showPassword,
  setShowPassword,
  loading,
  onSubmit
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <label htmlFor="libraryName" className="block text-sm font-medium text-gray-700 mb-2">
        Library Name *
      </label>
      <input
        id="libraryName"
        type="text"
        value={libraryData.name}
        onChange={(e) => setLibraryData({...libraryData, name: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter library name"
        required
      />
    </div>

    <div>
      <label htmlFor="libraryEmail" className="block text-sm font-medium text-gray-700 mb-2">
        Email Address *
      </label>
      <input
        id="libraryEmail"
        type="email"
        value={libraryData.email}
        onChange={(e) => setLibraryData({...libraryData, email: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter email address"
        required
      />
    </div>

    <div>
      <label htmlFor="libraryPhone" className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number *
      </label>
      <input
        id="libraryPhone"
        type="tel"
        value={libraryData.phone}
        onChange={(e) => setLibraryData({...libraryData, phone: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter phone number"
        required
      />
    </div>

    <div>
      <label htmlFor="libraryPassword" className="block text-sm font-medium text-gray-700 mb-2">
        Password *
      </label>
      <div className="relative">
        <input
          id="libraryPassword"
          type={showPassword ? 'text' : 'password'}
          value={libraryData.password}
          onChange={(e) => setLibraryData({...libraryData, password: e.target.value})}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Registering...' : 'Register Private Library'}
    </button>
  </form>
);

const StudentForm: React.FC<StudentFormProps> = ({
  studentData,
  setStudentData,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
  // College/Library search props
  collegeSearch,
  setCollegeSearch,
  collegeResults,
  showCollegeResults,
  selectedCollegeId,
  collegeSearchError,
  onCollegeSearch,
  onCollegeSelect
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
        Full Name *
      </label>
      <input
        id="studentName"
        type="text"
        value={studentData.name}
        onChange={(e) => setStudentData({...studentData, name: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter your full name"
        required
      />
    </div>

    <div>
      <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
        College/Library *
      </label>
      <div className="relative">
        <input
          id="college"
          type="text"
          value={collegeSearch}
          onChange={(e) => onCollegeSearch(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            collegeSearchError ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Start typing to search for your college or library..."
          required
        />
        
        {/* College/Library search results dropdown */}
        {showCollegeResults && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {collegeResults.map((college) => (
              <div
                key={college.id}
                onClick={() => onCollegeSelect(college)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">
                  {college.name} {college.collegeCode && `(${college.collegeCode})`}
                </div>
                <div className="text-sm text-gray-500">
                  {college.type === 'institution' ? '🏫 Institution' : '📚 Private Library'} • Click to select
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* College not registered error */}
        {collegeSearchError && (
          <div className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {collegeSearchError}
          </div>
        )}
        
        {/* Selected college/library indicator */}
        {selectedCollegeId && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <span className="mr-2">✅</span>
              <div>
                <div className="font-medium">
                  {collegeResults.find(c => c.id === selectedCollegeId)?.type === 'institution' ? (
                    <span>🏫 Institution Selected</span>
                  ) : (
                    <span>📚 Private Library Selected</span>
                  )}
                </div>
                <div className="text-sm text-green-600">
                  {collegeResults.find(c => c.id === selectedCollegeId)?.name}
                  {collegeResults.find(c => c.id === selectedCollegeId)?.collegeCode && (
                    <span> • Code: {collegeResults.find(c => c.id === selectedCollegeId)?.collegeCode}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div>
      <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
        Student ID *
      </label>
      <input
        id="studentId"
        type="text"
        value={studentData.studentId}
        onChange={(e) => setStudentData({...studentData, studentId: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter your student ID"
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
          Course (Class) *
        </label>
        <input
          id="course"
          type="text"
          value={studentData.course}
          onChange={(e) => setStudentData({...studentData, course: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter your course"
          required
        />
      </div>

      <div>
        <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
          Branch *
        </label>
        <input
          id="branch"
          type="text"
          value={studentData.branch}
          onChange={(e) => setStudentData({...studentData, branch: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter your branch"
          required
        />
      </div>
    </div>

    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
        Address *
      </label>
      <textarea
        id="address"
        value={studentData.address}
        onChange={(e) => setStudentData({...studentData, address: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter your address"
        rows={3}
        required
      />
    </div>

    <div>
      <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
        Mobile Number *
      </label>
      <input
        id="mobileNumber"
        type="tel"
        value={studentData.mobileNumber}
        onChange={(e) => setStudentData({...studentData, mobileNumber: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter your mobile number"
        required
      />
    </div>

    <div>
      <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-2">
        Email Address *
      </label>
      <input
        id="studentEmail"
        type="email"
        value={studentData.email}
        onChange={(e) => setStudentData({...studentData, email: e.target.value})}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Enter your email address"
        required
      />
    </div>

    <div>
      <label htmlFor="studentPassword" className="block text-sm font-medium text-gray-700 mb-2">
        Password *
      </label>
      <div className="relative">
        <input
          id="studentPassword"
          type={showPassword ? 'text' : 'password'}
          value={studentData.password}
          onChange={(e) => setStudentData({...studentData, password: e.target.value})}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Registering...' : 'Register Student'}
    </button>
  </form>
);

const RegisterForm: React.FC<RegisterFormProps> = ({ onBackClick }) => {
  const [userType, setUserType] = useState<'institution' | 'student' | 'privateLibrary' | null>(() => {
    // Initialize from localStorage to persist state on refresh
    const savedUserType = localStorage.getItem('ShelfaryX_register_userType');
    return savedUserType as 'institution' | 'student' | 'privateLibrary' | null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Institution form fields
  const [institutionData, setInstitutionData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    collegeCode: ''
  });

  // Student form fields
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    course: '',
    branch: '',
    college: '',
    mobileNumber: '',
    address: ''
  });

  // Private Library form fields
  const [libraryData, setLibraryData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  // College/Library search functionality
  const [collegeSearch, setCollegeSearch] = useState('');
  const [collegeResults, setCollegeResults] = useState<Array<{id: string, name: string, collegeCode: string, type: string}>>([]);
  const [showCollegeResults, setShowCollegeResults] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [collegeSearchError, setCollegeSearchError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // Save userType to localStorage whenever it changes
  useEffect(() => {
    if (userType) {
      localStorage.setItem('ShelfaryX_register_userType', userType);
    } else {
      localStorage.removeItem('ShelfaryX_register_userType');
    }
  }, [userType]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (userType) {
        // If we're on a specific form (institution or student), go back to selection
        setUserType(null);
        // Push a new state to prevent going back to login
        window.history.pushState(null, '', window.location.href);
      } else {
        // If we're on selection page, go back to login
        if (onBackClick) {
          onBackClick();
        }
      }
    };

    // Push initial state
    window.history.pushState(null, '', window.location.href);
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [userType, onBackClick]);

  // Handle manual back button clicks
  const handleBackClick = () => {
    if (userType) {
      // If we're on a specific form, go back to selection
      setUserType(null);
    } else {
      // If we're on selection page, go back to login
      if (onBackClick) {
        onBackClick();
      }
    }
  };

  // College search function
  const searchColleges = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setCollegeResults([]);
      setShowCollegeResults(false);
      setCollegeSearchError('');
      return;
    }

    try {
      const [institutions, privateLibraries] = await Promise.all([
        institutionService.getAllInstitutions(),
        privateLibraryService.getAllPrivateLibraries()
      ]);
      
      const institutionResults = institutions
        .filter(inst => 
          inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inst.collegeCode?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(inst => ({ 
          id: inst.id, 
          name: inst.name,
          collegeCode: inst.collegeCode || '',
          type: 'institution'
        }));

      const libraryResults = privateLibraries
        .filter(lib => 
          lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lib.libraryCode?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(lib => ({ 
          id: lib.id, 
          name: lib.name,
          collegeCode: lib.libraryCode || '',
          type: 'privateLibrary'
        }));

      const allResults = [...institutionResults, ...libraryResults];
      setCollegeResults(allResults);
      setShowCollegeResults(allResults.length > 0);
      setCollegeSearchError(allResults.length === 0 ? 'No institutions or libraries found' : '');
    } catch (error) {
      console.error('Error searching colleges and libraries:', error);
      setCollegeResults([]);
      setShowCollegeResults(false);
    }
  };

  // Handle college search input
  const handleCollegeSearch = (value: string) => {
    setCollegeSearch(value);
    setStudentData({...studentData, college: value});
    setSelectedCollegeId('');
    searchColleges(value);
  };

  // Handle college selection
  const handleCollegeSelect = (college: {id: string, name: string, collegeCode: string, type: string}) => {
    setCollegeSearch(college.name);
    setStudentData({...studentData, college: college.name});
    setSelectedCollegeId(college.id);
    setShowCollegeResults(false);
    setCollegeSearchError('');
  };

  const handleInstitutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await institutionService.registerInstitution({
        ...institutionData,
        address: 'Not provided', // Default address since field is removed
        isActive: true
      });
      setSuccess('Institution registered successfully! You can now login.');
      setTimeout(() => {
        if (onBackClick) onBackClick();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    }

    setLoading(false);
  };

  const handlePrivateLibrarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await privateLibraryService.registerPrivateLibrary({
        ...libraryData,
        isActive: true
      });
      setSuccess('Private Library registered successfully! You can now login.');
      setTimeout(() => {
        if (onBackClick) onBackClick();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    }

    setLoading(false);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate that a college is selected
    if (!selectedCollegeId) {
      setError('Please select a registered college from the search results.');
      setLoading(false);
      return;
    }

    try {
      await studentService.addStudent({
        ...studentData,
        institutionId: selectedCollegeId, // Use selected college ID
        isActive: true,
        class: studentData.course, // Use course as class
        section: 'A', // Default section
        collegeBranch: studentData.branch, // Use branch as collegeBranch
        branch: studentData.branch, // Also set branch field
        college: studentData.college, // Set college field
        joinDate: new Date().toISOString().split('T')[0]
      }, selectedCollegeId); // Use selected college ID
      setSuccess('Student registered successfully! You can now login.');
      setTimeout(() => {
        if (onBackClick) onBackClick();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Library className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-indigo-900">ShelfaryX</h1>
            </div>
            <button
              onClick={handleBackClick}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              
              <span>Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
                <Library className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">ShelfaryX</h1>
              <p className="text-gray-600">Create your account</p>
            </div>

            {!userType ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center mb-6">Choose Account Type</h2>
                
                <button
                  onClick={() => setUserType('institution')}
                  className="w-full flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Building className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Institution</h3>
                    <p className="text-sm text-gray-600">Register your college/university library</p>
                  </div>
                </button>

                <button
                  onClick={() => setUserType('student')}
                  className="w-full flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Student</h3>
                    <p className="text-sm text-gray-600">Register as a student to access your college library</p>
                  </div>
                </button>

                <button
                  onClick={() => setUserType('privateLibrary')}
                  className="w-full flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Private Library</h3>
                    <p className="text-sm text-gray-600">Register your own private library</p>
                  </div>
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">
                    Register as {userType === 'institution' ? 'Institution' : userType === 'student' ? 'Student' : 'Private Library'}
                  </h2>
                  <button
                    onClick={() => setUserType(null)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    Change Type
                  </button>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    {success}
                  </div>
                )}

                {userType === 'institution' ? (
                  <InstitutionForm
                    institutionData={institutionData}
                    setInstitutionData={setInstitutionData}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    loading={loading}
                    onSubmit={handleInstitutionSubmit}
                  />
                ) : userType === 'privateLibrary' ? (
                  <PrivateLibraryForm
                    libraryData={libraryData}
                    setLibraryData={setLibraryData}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    loading={loading}
                    onSubmit={handlePrivateLibrarySubmit}
                  />
                ) : (
                  <StudentForm
                    studentData={studentData}
                    setStudentData={setStudentData}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    loading={loading}
                    onSubmit={handleStudentSubmit}
                    // College search props
                    collegeSearch={collegeSearch}
                    setCollegeSearch={setCollegeSearch}
                    collegeResults={collegeResults}
                    showCollegeResults={showCollegeResults}
                    selectedCollegeId={selectedCollegeId}
                    collegeSearchError={collegeSearchError}
                    onCollegeSearch={handleCollegeSearch}
                    onCollegeSelect={handleCollegeSelect}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-2 bg-white rounded-lg">
                <Library className="w-6 h-6 text-indigo-900" />
              </div>
              <h3 className="text-2xl font-bold">ShelfaryX</h3>
            </div>
            <p className="text-indigo-200 mb-6 max-w-2xl mx-auto">
              Empowering students through knowledge, one book at a time. Join our community of learners and discover the endless possibilities that await you.
            </p>

            {/* Developer Credit */}
            <p className="text-indigo-300 mb-6">
              Developed by Anand Pandey
            </p>
            
            <div className="border-t border-indigo-800 pt-6">
              <p className="text-indigo-300">
                © 2025 ShelfaryX Library. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterForm; 

