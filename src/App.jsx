import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Import Pages
import Login from './pages/Login';
import RegisterLibrarian from './pages/RegisterLibrarian';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard'; 
import ManageBooks from './pages/ManageBooks';
import ManageMembers from './pages/ManageMembers';
import IssueBook from './pages/IssueBook';
import ManageFines from './pages/ManageFines';
import DashboardLayout from './components/DashboardLayout';
import AllBorrowedBooks from './pages/AllBorrowedBooks';
import AllBooks from './pages/AllBooks';
import ProtectedRoute from './components/ProtectedRoute'; 
import BookVault from './pages/BookVault';
import MyBooks from './pages/MyBooks';
import MyFines from './pages/MyFines';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <div id="particles-bg"></div>
          
          {/* --- UPDATED TOASTER --- */}
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              duration: 3000,
              // Professional style definitions
              style: {
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-main)',
                boxShadow: 'var(--shadow-hover)',
              },
              // Specific styles for each type
              success: {
                iconTheme: {
                  primary: 'var(--success-color)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--danger-color)',
                  secondary: 'white',
                },
              },
            }} 
          /> 

          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register-librarian" element={<RegisterLibrarian />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/borrowed-books" element={<AllBorrowedBooks />} />
                  <Route path="/admin/manage-books" element={<ManageBooks />} />
                  <Route path="/admin/all-books" element={<AllBooks />} />
                  <Route path="/admin/manage-members" element={<ManageMembers />} />
                  <Route path="/admin/issue-book" element={<IssueBook />} />
                  <Route path="/admin/manage-fines" element={<ManageFines />} />
                  
                  {/* User Routes */}
                  <Route path="/dashboard" element={<UserDashboard />} /> 
                  <Route path="/book-vault" element={<BookVault />} /> 
                  <Route path="/my-books" element={<MyBooks />} /> 
                  <Route path="/my-fines" element={<MyFines />} /> 
                  <Route path="/contact" element={<ContactPage />} /> 

              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;