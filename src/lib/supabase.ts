import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://glhwrkvcfrbyjocrigyo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaHdya3ZjZnJieWpvY3JpZ3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MjE5NTQsImV4cCI6MjA2OTI5Nzk1NH0.QQndoBJIGY4dS_18SmMaCkxfhrCDsAO9uaReUNUTCfU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  INSTITUTIONS: 'institutions',
  PRIVATE_LIBRARIES: 'private_libraries',
  BOOKS: 'books',
  CATEGORIES: 'categories',
  STUDENTS: 'students',
  ISSUES: 'book_issues',
  LIBRARIANS: 'librarians',
  NOTIFICATIONS: 'notifications',
} as const; 