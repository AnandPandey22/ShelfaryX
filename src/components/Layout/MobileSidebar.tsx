import React from 'react';
import { X, BarChart3, FolderOpen, BookOpen, Users, BookPlus, ClipboardList, CheckCircle, AlertTriangle, FileText, Library, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LogoutModal from './LogoutModal';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  const { currentUser, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'categories', label: 'Book Categories', icon: FolderOpen },
    { id: 'books', label: 'Manage Books', icon: BookOpen },
    { id: 'students', label: 'Manage Students', icon: Users },
    { id: 'issue-book', label: 'Issue Book', icon: BookPlus },
    { id: 'issued-books', label: 'Issued Books', icon: ClipboardList },
    { id: 'returned-books', label: 'Books Returned', icon: CheckCircle },
    { id: 'overdue', label: 'Overdue Books', icon: AlertTriangle },
    { id: 'download-invoice', label: 'Download Invoice', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
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
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">
                {currentUser?.name?.charAt(0) || 'L'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser?.name || 'Librarian'}</p>
              <p className="text-sm text-gray-500">{currentUser?.email || 'librarian@bookzone.com'}</p>
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
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
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

export default MobileSidebar; 