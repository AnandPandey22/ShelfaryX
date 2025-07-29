import React, { useState, useEffect } from 'react';
import { Library, Eye, EyeOff, ArrowLeft, BookOpen, Users, BookPlus, ClipboardList, AlertTriangle, BarChart3, FolderOpen, UserPlus, Mail, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { passwordResetService } from '../../services/passwordReset';
import { dbPasswordResetService } from '../../services/database';

interface LoginFormProps {
  onHomeClick?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onHomeClick, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const { login } = useAuth();

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (onHomeClick) {
        onHomeClick();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onHomeClick]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);

    try {
      // Get user type by email
      const userType = await dbPasswordResetService.getUserTypeByEmail(resetEmail);
      
      if (!userType) {
        setResetError('Email address not found in our system.');
        return;
      }
      
      // Generate a secure reset token
      const resetToken = passwordResetService.generateResetToken();
      
      // Store the token in database
      const tokenStored = await dbPasswordResetService.storeResetToken(resetEmail, resetToken, userType);
      
      if (!tokenStored) {
        throw new Error('Failed to store reset token');
      }
      
      // Send the reset email
      const emailSent = await passwordResetService.sendResetEmail({
        email: resetEmail,
        resetToken,
        userType,
        userName: resetEmail.split('@')[0]
      });
      
      if (!emailSent) {
        throw new Error('Failed to send reset email');
      }
      
      setResetSuccess(true);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      setResetError('Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Overview',
      description: 'Get real-time insights into library operations, book statistics, and student activities.'
    },
    {
      icon: FolderOpen,
      title: 'Book Categories',
      description: 'Organize and manage books by categories for easy navigation and discovery.'
    },
    {
      icon: BookOpen,
      title: 'Book Management',
      description: 'Add, edit, and manage your entire book collection with detailed information.'
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Maintain comprehensive student records and track their borrowing history.'
    },
    {
      icon: BookPlus,
      title: 'Issue Books',
      description: 'Streamlined process to issue books to students with automatic due date calculation.'
    },
    {
      icon: ClipboardList,
      title: 'Track Issued Books',
      description: 'Monitor all currently issued books and manage returns efficiently.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Library className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-indigo-900">BookZone</h1>
            </div>
            <button
              onClick={onHomeClick}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <span>Home</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Login Form Column */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Library className="w-8 h-8 text-white" />
          </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">BookZone</h1>
          <p className="text-gray-600">Dashboard - Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
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
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onRegisterClick}
                className="text-indigo-600 hover:text-indigo-700 font-medium underline"
              >
                Register Now
              </button>
            </p>
          </div>
        </form>
            </div>

            {/* Features Column */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">BookZone Features</h2>
                <p className="text-gray-600">Discover the powerful tools available in your library management system</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-indigo-50 transition-colors">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-indigo-900">{feature.title}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-2 bg-white rounded-lg">
                <Library className="w-6 h-6 text-indigo-900" />
              </div>
              <h3 className="text-2xl font-bold">BookZone</h3>
            </div>
            <p className="text-indigo-200 mb-6 max-w-2xl mx-auto">
              Empowering students through knowledge, one book at a time. Join our community of learners and discover the endless possibilities that await you.
            </p>
            <div className="border-t border-indigo-800 pt-6">
              <p className="text-indigo-300">
                © 2025 BookZone Library. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
              </div>
              <button
                onClick={handleCloseForgotPassword}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {!resetSuccess ? (
              <>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {resetError && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                      {resetError}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseForgotPassword}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {resetLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </p>
                <button
                  onClick={handleCloseForgotPassword}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;