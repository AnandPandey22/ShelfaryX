import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  BookPlus, 
  ClipboardList, 
  AlertTriangle, 
  BarChart3,
  FolderOpen,
  UserPlus,
  LogOut,
  Library,
  CheckCircle,
  FileText,
  Database
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LogoutModal from './LogoutModal';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onHomeClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, onHomeClick }) => {
  const { currentUser, userType, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const menuItems = [
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

  // Aggressively disable back button when logged in
  useEffect(() => {
    if (currentUser) {
      // Override history methods
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;
      
      window.history.pushState = function() {
        // Do nothing - prevent navigation
        return;
      };
      
      window.history.replaceState = function() {
        // Do nothing - prevent navigation
        return;
      };

      // Prevent popstate
      const handlePopState = (event: PopStateEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.history.go(0); // Stay on current page
        return false;
      };

      // Prevent beforeunload
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        delete event.returnValue;
        return false;
      };

      // Prevent unload
      const handleUnload = (event: Event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      };

      // Prevent keyboard shortcuts
      const handleKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement;
        const isInput = (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        );
        if ((event.key === 'Backspace' || event.key === 'Escape') && !isInput) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return false;
        }
      };

      // Prevent mouse events
      const handleMouseDown = (event: MouseEvent) => {
        if (event.button === 3 || event.button === 4) { // Back/Forward buttons
          event.preventDefault();
          event.stopImmediatePropagation();
          return false;
        }
      };

      // Prevent touch events
      const handleTouchStart = (event: TouchEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      };

      const handleTouchEnd = (event: TouchEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      };

      // Prevent context menu
      const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      };

      // Add event listeners
      window.addEventListener('popstate', handlePopState, { capture: true });
      window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
      window.addEventListener('unload', handleUnload, { capture: true });
      window.addEventListener('keydown', handleKeyDown, { capture: true });
      window.addEventListener('mousedown', handleMouseDown, { capture: true });
      window.addEventListener('touchstart', handleTouchStart, { capture: true });
      window.addEventListener('touchend', handleTouchEnd, { capture: true });
      window.addEventListener('contextmenu', handleContextMenu, { capture: true });

      // Cleanup function
      return () => {
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
        window.removeEventListener('popstate', handlePopState, { capture: true });
        window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
        window.removeEventListener('unload', handleUnload, { capture: true });
        window.removeEventListener('keydown', handleKeyDown, { capture: true });
        window.removeEventListener('mousedown', handleMouseDown, { capture: true });
        window.removeEventListener('touchstart', handleTouchStart, { capture: true });
        window.removeEventListener('touchend', handleTouchEnd, { capture: true });
        window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      };
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    if (onHomeClick) {
      onHomeClick();
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Library className="w-6 h-6 text-white" />
          </div>
          <div>
              <h1 className="text-xl font-bold text-gray-900">ShelfaryX</h1>
            <p className="text-sm text-gray-500">Librarian Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-700">
                {currentUser?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.name}
            </p>
            <p className="text-xs text-gray-500">
                {currentUser?.email}
            </p>
          </div>
        </div>
        <button
            onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default Sidebar;
