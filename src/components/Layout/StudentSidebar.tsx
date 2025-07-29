import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  History, 
  Bell, 
  User, 
  LogOut,
  FileText,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface StudentSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  unreadNotificationsCount?: number;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeSection,
  onSectionChange,
  onLogout,
  unreadNotificationsCount = 0
}) => {
  const { currentUser } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview of your library activity'
    },
    {
      id: 'issued-books',
      label: 'Issued Books',
      icon: BookOpen,
      description: 'Currently borrowed books'
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      description: 'Previously returned books'
    },
    {
      id: 'overdue',
      label: 'Overdue Books',
      icon: AlertTriangle,
      description: 'Books past due date'
    },
    {
      id: 'due-soon',
      label: 'Due Soon',
      icon: Clock,
      description: 'Books due within 3 days'
    },
    {
      id: 'download-invoice',
      label: 'Download Invoice',
      icon: FileText,
      description: 'Download your book invoices'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Library updates and alerts'
    }
  ];

  return (
    <div className="hidden lg:flex w-72 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">BookZone</h1>
            <p className="text-sm text-gray-500">Student Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                {item.id === 'notifications' && unreadNotificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className={`text-xs ${
                  isActive ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section - Profile and Actions */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Profile Section */}
        <button
          onClick={() => onSectionChange('profile')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
            activeSection === 'profile'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <User className={`w-5 h-5 ${
            activeSection === 'profile' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
          }`} />
          <div className="flex-1">
            <div className="font-medium">Profile</div>
            <div className={`text-xs ${
              activeSection === 'profile' ? 'text-indigo-600' : 'text-gray-500'
            }`}>
              Edit your information
            </div>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-700 hover:bg-red-50 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" />
          <div className="flex-1">
            <div className="font-medium">Sign Out</div>
            <div className="text-xs text-red-500">Logout from your account</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar; 