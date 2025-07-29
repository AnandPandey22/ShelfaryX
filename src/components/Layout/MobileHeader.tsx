import React from 'react';
import { Menu, Library } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* BookZone Logo */}
        <div className="flex items-center space-x-3">
          {/* Logo Icon - Same as homepage */}
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Library className="w-6 h-6 text-white" />
          </div>
          
          {/* Text */}
          <div>
            <h1 className="text-lg font-bold text-indigo-900">BookZone</h1>
            <p className="text-xs text-gray-500">Librarian Portal</p>
          </div>
        </div>
        
        {/* Hamburger Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-indigo-50 transition-colors group"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-indigo-600 group-hover:text-indigo-700" />
        </button>
      </div>
    </div>
  );
};

export default MobileHeader; 