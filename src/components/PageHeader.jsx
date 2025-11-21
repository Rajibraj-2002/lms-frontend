// src/components/PageHeader.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Clock from './Clock'; // Imports the functional Clock component

const PageHeader = ({ title, subtitle }) => {
    const { role, username } = useAuth();
    
    // Determine the base welcome text
    const baseTitle = role === 'LIBRARIAN' ? 'Admin Dashboard' : 'My Dashboard';
    const finalTitle = title || baseTitle;

    return (
        // Reuses the styling from the top-bar section in style.css
        <div className="top-bar">
            {/* Left Side: Dynamic Welcome Message */}
            <div className="top-bar-welcome">
                <h3>{finalTitle}</h3>
                <p>Welcome back, <strong>{username || 'User'}</strong>!</p>
            </div>

            {/* Right Side: Interactive Clock */}
            <div className="top-bar-actions">
                <Clock />
            </div>
        </div>
    );
};

export default PageHeader;