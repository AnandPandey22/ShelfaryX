import React, { createContext, useContext, useState, useEffect } from 'react';
import { Institution, Student, Book, BookIssue } from '../types';
import { adminService } from '../services/database';

interface AdminStatistics {
  totalInstitutions: number;
  totalStudents: number;
  totalBooks: number;
  totalIssuedBooks: number;
  totalReturnedBooks: number;
  totalOverdueBooks: number;
  institutions: Institution[];
  students: Student[];
  books: Book[];
  issues: BookIssue[];
}

interface AdminContextType {
  statistics: AdminStatistics | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const refreshData = async () => {
    await loadData();
  };

  const value = {
    statistics,
    loading,
    refreshData,
    isAdmin,
    setIsAdmin,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}; 