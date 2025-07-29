import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LibraryProvider } from './contexts/LibraryContext';

import HomePage from './components/HomePage';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import MobileHeader from './components/Layout/MobileHeader';
import MobileSidebar from './components/Layout/MobileSidebar';
import MobileWelcome from './components/MobileWelcome';
import RegisterForm from './components/Auth/RegisterForm';
import StudentDashboard from './components/StudentDashboard';
import Dashboard from './components/Dashboard';
import BookCategories from './components/BookCategories';
import BookManagement from './components/BookManagement';
import StudentManagement from './components/StudentManagement';
import IssueBook from './components/IssueBook';
import IssuedBooks from './components/IssuedBooks';
import OverdueBooks from './components/OverdueBooks';
import Reports from './components/Reports';
import BooksReturned from './components/BooksReturned';
import DownloadInvoice from './components/DownloadInvoice';
import AdminPanel from './components/Admin/AdminPanel';
import ResetPassword from './components/Auth/ResetPassword';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              The application encountered an error. Please refresh the page or check the console for details.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { currentUser, userType, institutionId, logout } = useAuth();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [showHomePage, setShowHomePage] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // lg breakpoint
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(() => {
    // Initialize from localStorage to persist state on refresh
    return localStorage.getItem('bookzone_show_register_form') === 'true';
  });

  // Check if we're on reset password page
  const [showResetPassword, setShowResetPassword] = useState(() => {
    return window.location.pathname === '/reset-password' || window.location.search.includes('reset-password');
  });

  // Add error logging
  useEffect(() => {
    console.log('AppContent mounted');
    console.log('Current user:', currentUser);
    console.log('User type:', userType);
  }, [currentUser, userType]);

  // Save register form state to localStorage
  useEffect(() => {
    if (showRegisterForm) {
      localStorage.setItem('bookzone_show_register_form', 'true');
    } else {
      localStorage.removeItem('bookzone_show_register_form');
    }
  }, [showRegisterForm]);

  // Mobile responsive effect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Aggressively disable back button when logged in
  useEffect(() => {
    if (currentUser) {
      // If the user is logged in, we don't want to show the welcome message
      // and we don't want to show the home page.
      // This effect ensures that if the user is logged in, the welcome message
      // and home page are hidden, and the default section is set to 'dashboard'.
      setShowWelcomeMessage(false);
      setShowHomePage(false);
      setActiveSection('dashboard');
    }
  }, [currentUser]);

  // Handle initial navigation state and refresh
  useEffect(() => {
    try {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const currentHash = window.location.hash;
      
      console.log('Navigation state:', { currentPath, currentSearch, currentHash });
      
      // Check if we're on login page (either by path or query parameter)
      if (currentPath === '/login' || currentSearch.includes('login') || currentHash.includes('login')) {
        setShowHomePage(false);
        // Update URL to reflect login state
        if (currentPath !== '/login') {
          window.history.replaceState({ page: 'login' }, '', '/login');
        }
      } else if (currentPath === '/dashboard') {
        setShowHomePage(false);
      } else {
        setShowHomePage(true);
      }
    } catch (error) {
      console.error('Error handling navigation state:', error);
    }
  }, []);

  const handleLoginClick = () => {
    setShowHomePage(false);
    window.history.pushState({ page: 'login' }, '', '/login');
  };



  const handleHomeClick = () => {
    setShowHomePage(true);
    window.history.pushState({ page: 'home' }, '', '/');
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Push new state to history
    window.history.pushState({ page: 'dashboard', section }, '', `/dashboard?section=${section}`);
  };

  const handleMobileMenuClick = () => {
    setIsMobileSidebarOpen(true);
    // Don't hide welcome message just for opening menu
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
  };

  const handleRegisterBack = () => {
    setShowRegisterForm(false);
    // Clear both register form state and user type state
    localStorage.removeItem('bookzone_show_register_form');
    localStorage.removeItem('bookzone_register_userType');
  };

  const renderContent = () => {
    try {
      // Show student dashboard for students
      if (userType === 'student') {
        return <StudentDashboard />;
      }

      // Show librarian dashboard for institutions and librarians
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <BookCategories />;
      case 'books':
        return <BookManagement />;
      case 'students':
        return <StudentManagement />;
      case 'issue-book':
        return <IssueBook />;
      case 'issued-books':
        return <IssuedBooks />;
      case 'overdue':
          return <OverdueBooks />;
      case 'reports':
          return <Reports />;
        case 'returned-books':
          return <BooksReturned />;
        case 'download-invoice':
          return <DownloadInvoice />;
        case 'home':
          return <MobileWelcome />;
      default:
        return <Dashboard />;
    }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="p-8 text-center text-red-600">
          Error loading content. Please refresh the page.
        </div>
      );
    }
  };

  // Check for admin access
  if (userType === 'admin') {
    return <AdminPanel />;
  }

  if (!currentUser) {
    if (showResetPassword) {
      return <ResetPassword />;
    }
    
    if (showRegisterForm) {
      return <RegisterForm onBackClick={handleRegisterBack} />;
    }
    
    return (
      <div className="min-h-screen bg-gray-50">
        {showHomePage ? (
          <HomePage onLoginClick={handleLoginClick} />
        ) : (
          <LoginForm onHomeClick={handleHomeClick} onRegisterClick={handleRegisterClick} />
        )}
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    if (userType === 'student') {
      // For students, render StudentDashboard which has its own mobile handling
      return (
        <div className="h-screen bg-gray-50">
          {renderContent()}
        </div>
      );
    }

    return (
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileSidebarOpen}
          onClose={handleMobileSidebarClose}
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
        />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <MobileHeader onMenuClick={handleMobileMenuClick} />
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pt-24">
            <div className="p-4">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Desktop layout
  if (userType === 'student') {
    // For students, render StudentDashboard which has its own sidebar
    return (
      <div className="h-screen bg-gray-50">
        {renderContent()}
      </div>
    );
  }

  // For institutions and librarians, render with sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
        onHomeClick={handleHomeClick}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LibraryProvider>
          <AppContent />
        </LibraryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;