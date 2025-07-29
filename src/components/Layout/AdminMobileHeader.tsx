import React from 'react';
import { Menu, Library } from 'lucide-react';

interface AdminMobileHeaderProps {
  onMenuClick: () => void;
}

const AdminMobileHeader: React.FC<AdminMobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* BookZone Logo */}
        <div className="flex items-center space-x-3">
          {/* Logo Icon - Same as homepage */}
          <div className="p-2 bg-blue-600 rounded-lg">
            <Library className="w-6 h-6 text-white" />
          </div>
          
          {/* Text */}
          <div>
            <h1 className="text-lg font-bold text-blue-900">BookZone</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
        
        {/* Hamburger Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-blue-50 transition-colors group"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
        </button>
      </div>
    </div>
  );
};

export default AdminMobileHeader; 