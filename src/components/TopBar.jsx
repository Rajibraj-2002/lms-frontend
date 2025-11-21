// src/components/TopBar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiBell, FiUser } from 'react-icons/fi';
import Clock from './Clock'; // Import the new Clock component

const TopBar = () => {
    const { role, token, username } = useAuth(); // Get username from context
    
    // This state is for the notification data
    const [notifications, setNotifications] = useState([]);
    // This state is for toggling the dropdown
    const [showDropdown, setShowDropdown] = useState(false); // <-- FIX: This is now used
    const [unreadCount, setUnreadCount] = useState(0);


    useEffect(() => {
        if (!token) return;
        if (role === 'USER') {
            const fetchData = async () => {
                try {
                    const [notifRes, booksRes] = await Promise.all([
                        axios.get('http://localhost:8080/api/user/my-notifications', { headers: { Authorization: `Bearer ${token}` } }),
                        axios.get('http://localhost:8080/api/user/my-books', { headers: { Authorization: `Bearer ${token}` } })
                    ]);

                    let allNotifs = [...notifRes.data];

                    // Check for books due soon
                    booksRes.data.forEach(book => {
                        const daysLeft = Math.ceil((new Date(book.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                        if (daysLeft <= 3 && daysLeft >= 0) {
                            allNotifs.push({
                                id: `temp-${book.bookIsbn}`,
                                message: `⚠️ Reminder: '${book.bookTitle}' is due in ${daysLeft} days!`
                            });
                        }
                    });
                    
                    setNotifications(allNotifs); // <-- FIX: 'setNotifications' is now used
                    setUnreadCount(allNotifs.length); 

                } catch (err) { console.error(err); }
            };
            fetchData();
        }
    }, [role, token]);

    // FIX: This handler uses setShowDropdown
    const handleBellClick = async (e) => {
        e.preventDefault();
        setShowDropdown(!showDropdown); // <-- FIX: 'setShowDropdown' is now used

        if (!showDropdown && unreadCount > 0) {
            setUnreadCount(0); 
            try {
                await axios.post('http://localhost:8080/api/user/my-notifications/mark-read', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) { console.error("Error marking read:", err); }
        }
    };

    return (
        <div className="top-bar">
            {/* Left Side: Welcome Message */}
            <div className="top-bar-welcome">
                <h3>{role === 'LIBRARIAN' ? 'Admin Dashboard' : 'My Dashboard'}</h3>
                <p>Welcome back, <strong>{username || 'User'}</strong>!</p>
            </div>

            {/* Right Side: Icons & Clock */}
            <div className="top-bar-actions">
                
                <Clock />

                {role === 'USER' && (
                    <div className="notification-container">
                        <div className="icon-wrapper" onClick={handleBellClick}>
                            <FiBell />
                            {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
                        </div>
                        
                        {/* FIX: 'showDropdown' is now used here */}
                        <div className={`notification-dropdown ${showDropdown ? 'show' : ''}`}>
                            <div className="notification-header">Notifications</div>
                            <ul className="notification-list">
                                {notifications.length === 0 ? (
                                    <li className="notification-item empty">No new notifications</li>
                                ) : (
                                    notifications.map((n, index) => (
                                        <li key={n.id || index} className="notification-item">{n.message}</li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                )}
                
                {/* Profile icon is a placeholder for now */}
                <div className="user-profile">
                    <div className="icon-wrapper"><FiUser /></div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;