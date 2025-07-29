import React from 'react';
import { Library } from 'lucide-react';

const MobileWelcome: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full mb-8">
          <Library className="w-10 h-10 text-white" />
        </div>
        
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-indigo-900 mb-4">
          Welcome to <span className="text-indigo-600">BookZone</span>
        </h1>
        <p className="text-lg text-gray-600 font-medium mb-4">
          A Library Management System
        </p>
        <p className="text-gray-600 mb-8">
          Your gateway to knowledge, growth, and endless possibilities. Discover the world through the pages of our carefully curated collection.
        </p>
        
        {/* Instructions - Plain text */}
        <p className="text-lg text-gray-600 font-medium">
          Click on the menu button to access the features of BookZone.
        </p>
      </div>
    </div>
  );
};

export default MobileWelcome; 