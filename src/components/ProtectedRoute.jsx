// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // 1. Get the token from our synchronous context
    const { token } = useAuth();

    // 2. If there is no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // 3. If there IS a token, show the dashboard
    return <Outlet />;
};

export default ProtectedRoute;