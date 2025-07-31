import React, { useState, useEffect } from 'react';
import { Building2, Users, BookOpen, ClipboardList, AlertTriangle, CheckCircle, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/database';
import AdminInstitutions from './AdminInstitutions';
import AdminPrivateLibraries from './AdminPrivateLibraries';
import AdminStudents from './AdminStudents';
import AdminBooks from './AdminBooks';
import AdminIssues from './AdminIssues';
import AdminMobileHeader from '../Layout/AdminMobileHeader';
import AdminMobileSidebar from '../Layout/AdminMobileSidebar';

const AdminPanel: React.FC = () => {
  const { logout } = useAuth();
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'institutions' | 'privateLibraries' | 'students' | 'books' | 'issues'>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAdminStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleDataRefresh = () => {
    // This will be handled by the individual components
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Institutions',
      value: statistics.totalInstitutions,
      icon: Building2,
      color: 'blue',
      description: 'Registered institutions',
    },
    {
      title: 'Total Students',
      value: statistics.totalStudents,
      icon: Users,
      color: 'green',
      description: 'Across all institutions',
    },
    {
      title: 'Total Books',
      value: statistics.totalBooks,
      icon: BookOpen,
      color: 'purple',
      description: 'In library system',
    },
    {
      title: 'Currently Issued',
      value: statistics.totalIssuedBooks,
      icon: ClipboardList,
      color: 'orange',
      description: 'Books out on loan',
    },
    {
      title: 'Returned Books',
      value: statistics.totalReturnedBooks,
      icon: CheckCircle,
      color: 'green',
      description: 'Successfully returned',
    },
    {
      title: 'Overdue Books',
      value: statistics.totalOverdueBooks,
      icon: AlertTriangle,
      color: 'red',
      description: 'Need attention',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'institutions', name: 'Institutions', icon: Building2 },
    { id: 'privateLibraries', name: 'Private Libraries', icon: Building2 },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'books', name: 'Books', icon: BookOpen },
    { id: 'issues', name: 'Issues', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <AdminMobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
      
      {/* Mobile Sidebar */}
      <AdminMobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-8 pt-16">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-2">Comprehensive overview of all institutions and library data</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden lg:block mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const [bgColor, textColor, cardBg] = colorClasses[stat.color as keyof typeof colorClasses].split(' ');
                  
                                     return (
                     <div key={index} className={`${cardBg} rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                          <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                        </div>
                        <div className={`p-3 ${bgColor} rounded-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
                  <div className="space-y-3">
                                        {statistics.issues.slice(0, 5).map((issue: any) => {
                      const book = statistics.books.find((b: any) => b.id === issue.bookId);
                      const student = statistics.students.find((s: any) => s.id === issue.studentId);
                      
                      // Enhanced institution/library lookup with string comparison
                      let institutionName = 'Unknown Institution';
                      const institution = statistics.institutions.find((i: any) => String(i.id) === String(issue.institutionId));
                      if (institution) {
                        institutionName = institution.name;
                      } else {
                        const library = statistics.privateLibraries.find((l: any) => String(l.id) === String(issue.institutionId));
                        if (library) {
                          institutionName = library.name;
                        }
                      }
                      
                      return (
                        <div key={issue.id} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                          <div>
                            <p className="font-medium text-gray-900">{book?.title}</p>
                            <p className="text-sm text-gray-600">{student?.name} • {institutionName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Due: {issue.dueDate}</p>
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
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Institutions & Libraries</h2>
                  <div className="space-y-3">
                    {/* Institutions */}
                    {statistics.institutions
                      .sort((a: any, b: any) => {
                        const aStudents = statistics.students.filter((s: any) => String(s.institutionId) === String(a.id)).length;
                        const bStudents = statistics.students.filter((s: any) => String(s.institutionId) === String(b.id)).length;
                        return bStudents - aStudents;
                      })
                      .slice(0, 3)
                      .map((institution: any) => {
                        const studentCount = statistics.students.filter((s: any) => String(s.institutionId) === String(institution.id)).length;
                        const bookCount = statistics.books.filter((b: any) => String(b.institutionId) === String(institution.id)).length;
                        
                        return (
                          <div key={institution.id} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                            <div>
                              <p className="font-medium text-gray-900">{institution.name}</p>
                              <p className="text-sm text-gray-600">{institution.collegeCode} (Institution)</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{studentCount} students</p>
                              <p className="text-xs text-gray-500">{bookCount} books</p>
                            </div>
                          </div>
                        );
                      })}
                    
                    {/* Private Libraries */}
                    {statistics.privateLibraries
                      .sort((a: any, b: any) => {
                        const aStudents = statistics.students.filter((s: any) => String(s.institutionId) === String(a.id)).length;
                        const bStudents = statistics.students.filter((s: any) => String(s.institutionId) === String(b.id)).length;
                        return bStudents - aStudents;
                      })
                      .slice(0, 2)
                      .map((library: any) => {
                        const studentCount = statistics.students.filter((s: any) => String(s.institutionId) === String(library.id)).length;
                        const bookCount = statistics.books.filter((b: any) => String(b.institutionId) === String(library.id)).length;
                        
                        return (
                          <div key={library.id} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                            <div>
                              <p className="font-medium text-gray-900">{library.name}</p>
                              <p className="text-sm text-gray-600">{library.libraryCode} (Private Library)</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{studentCount} students</p>
                              <p className="text-xs text-gray-500">{bookCount} books</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'institutions' && (
            <div className="overflow-y-auto scrollbar-hide">
              <AdminInstitutions institutions={statistics.institutions} onRefresh={handleDataRefresh} />
            </div>
          )}
          {activeTab === 'privateLibraries' && (
            <div className="overflow-y-auto scrollbar-hide">
              <AdminPrivateLibraries privateLibraries={statistics.privateLibraries} onRefresh={handleDataRefresh} />
            </div>
          )}
          {activeTab === 'students' && (
            <div className="overflow-y-auto scrollbar-hide">
              <AdminStudents students={statistics.students} institutions={statistics.institutions} privateLibraries={statistics.privateLibraries} onRefresh={handleDataRefresh} />
            </div>
          )}
          {activeTab === 'books' && (
            <div className="overflow-y-auto scrollbar-hide">
              <AdminBooks books={statistics.books} institutions={statistics.institutions} privateLibraries={statistics.privateLibraries} />
            </div>
          )}
          {activeTab === 'issues' && (
            <div className="overflow-y-auto scrollbar-hide">
              <AdminIssues issues={statistics.issues} books={statistics.books} students={statistics.students} institutions={statistics.institutions} privateLibraries={statistics.privateLibraries} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 