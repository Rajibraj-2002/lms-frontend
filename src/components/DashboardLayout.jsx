// src/components/DashboardLayout.jsx
import React from 'react';
import Navbar from './Navbar'; // 1. Import Navbar
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        // The body class is no longer needed
        <div className="app-wrapper"> 
            
            {/* 2. Render Navbar at the top */}
            <Navbar />
            
            {/* Main Content Area */}
            <main className="main-content">
                <div className="main-content-container">
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;