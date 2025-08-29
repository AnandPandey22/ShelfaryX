import React, { createContext, useContext, useState, useEffect } from 'react';
import { Librarian, Student, Institution, PrivateLibrary, Admin } from '../types';
import { librarianService, studentService, institutionService, privateLibraryService, adminService } from '../services/database';

type UserType = 'institution' | 'student' | 'librarian' | 'admin' | 'privateLibrary';

interface AuthContextType {
  currentUser: Librarian | Student | Institution | PrivateLibrary | Admin | null;
  userType: UserType | null;
  institutionId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Librarian | Student | Institution | PrivateLibrary | Admin | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedAuth = localStorage.getItem('ShelfaryX_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setCurrentUser(authData.user);
        setUserType(authData.userType);
        setInstitutionId(authData.institutionId);
      } catch (error) {
        localStorage.removeItem('ShelfaryX_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Try to authenticate as admin first
      const adminResult = await adminService.authenticateAdmin(email, password);
      if (adminResult?.isAdmin) {
        const authData = {
          user: { id: 'admin', email, name: 'Admin' },
          userType: 'admin' as UserType,
          institutionId: null,
          token: 'ShelfaryX-auth-token',
        };
        
        localStorage.setItem('ShelfaryX_auth', JSON.stringify(authData));
        setCurrentUser({ id: 'admin', email, name: 'Admin' });
        setUserType('admin');
        setInstitutionId(null);
        setIsLoading(false);
        return true;
      }

      // Try to authenticate as institution
      let user: Librarian | Student | Institution | PrivateLibrary | Admin | null = null;
      let type: UserType = 'institution';
      let instId: string | null = null;

      const institution = await institutionService.authenticateInstitution(email, password);
      if (institution) {
        user = institution;
        type = 'institution';
        instId = institution.id;
      } else {
        // Try to authenticate as private library
        const privateLibrary = await privateLibraryService.authenticatePrivateLibrary(email, password);
        if (privateLibrary) {
          user = privateLibrary;
          type = 'privateLibrary';
          instId = privateLibrary.id;
        } else {
          // Try to authenticate as student
          const student = await studentService.authenticateStudent(email, password);
          if (student) {
            user = student;
            type = 'student';
            instId = student.institutionId;
          } else {
            // Try to authenticate as librarian
            const librarian = await librarianService.authenticate(email, password);
            if (librarian) {
              user = librarian;
              type = 'librarian';
              instId = librarian.institutionId;
            }
          }
        }
      }

      if (user) {
        const authData = {
          user: user,
          userType: type,
          institutionId: instId,
          token: 'ShelfaryX-auth-token',
        };
        
        localStorage.setItem('ShelfaryX_auth', JSON.stringify(authData));
        setCurrentUser(user);
        setUserType(type);
        setInstitutionId(instId);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ShelfaryX_auth');
    setCurrentUser(null);
    setUserType(null);
    setInstitutionId(null);
  };

  const value = {
    currentUser,
    userType,
    institutionId,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
