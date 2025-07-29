import React from 'react';
import { X, LayoutDashboard, BookOpen, History, Bell, User, LogOut, FileText, AlertTriangle, Clock, Library, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LogoutModal from './LogoutModal';

interface StudentMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const StudentMobileSidebar: React.FC<StudentMobileSidebarProps> = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  const { currentUser, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview and quick stats' },
    { id: 'issued-books', label: 'Issued Books', icon: BookOpen, description: 'Currently borrowed books' },
    { id: 'history', label: 'History', icon: History, description: 'Previously returned books' },
    { id: 'overdue', label: 'Overdue Books', icon: AlertTriangle, description: 'Books past due date' },
    { id: 'due-soon', label: 'Due Soon', icon: Clock, description: 'Books due within 3 days' },
    { id: 'download-invoice', label: 'Download Invoice', icon: FileText, description: 'Download your book invoices' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Library updates and alerts' },
  ];

  const handleSectionClick = (section: string) => {
    onSectionChange(section);
    onClose(); // Close sidebar after selection
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`lg:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {currentUser?.name?.charAt(0) || 'S'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser?.name || 'Student'}</p>
              <p className="text-sm text-gray-500">{currentUser?.email || 'student@bookzone.com'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleSectionClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <span className="font-medium">{item.label}</span>
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default StudentMobileSidebar; 