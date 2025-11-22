// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import axios from 'axios';
// 1. ADD FiLock to the imports
import { FiBell, FiUser, FiLogOut, FiCreditCard, FiSun, FiMoon, FiMenu, FiX, FiSearch, FiPhone, FiMail, FiShield, FiLock } from 'react-icons/fi';
import { RiBookmarkLine, RiWalletLine, RiUserStarLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { role, token, username, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    
    // State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [profileData, setProfileData] = useState(null);
    
    // Change Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });

    // Refs
    const notifIconRef = useRef(null);
    const notifDropdownRef = useRef(null);
    const profileIconRef = useRef(null);
    const profileDropdownRef = useRef(null);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Fetch Notifications
    useEffect(() => {
        if (!token) return;
        
        let endpoint = '';
        if (role === 'USER') endpoint = 'https://lms-backend-0jw8.onrender.com/api/user/my-notifications';
        else if (role === 'LIBRARIAN') endpoint = 'https://lms-backend-0jw8.onrender.com/api/admin/my-notifications';
        else return;

        const fetchData = async () => {
            try {
                const notifRes = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
                let allNotifs = notifRes.data;

                if (role === 'USER') {
                    const booksRes = await axios.get('https://lms-backend-0jw8.onrender.com/api/user/my-books', { headers: { Authorization: `Bearer ${token}` } });
                    booksRes.data.forEach(book => {
                        const daysLeft = Math.ceil((new Date(book.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                        if (daysLeft <= 3 && daysLeft >= 0) {
                            allNotifs.push({ id: `temp-${book.isbn}`, message: `⚠️ Reminder: '${book.title}' is due in ${daysLeft} days!` });
                        } else if (daysLeft < 0) {
                             allNotifs.push({ id: `temp-overdue-${book.isbn}`, message: `🚨 OVERDUE: '${book.title}' was due on ${book.dueDate}.`});
                        }
                    });
                }
                setNotifications(allNotifs);
                setUnreadCount(allNotifs.length);
            } catch (err) { console.error("Error loading data:", err); }
        };
        fetchData();
    }, [role, token, location]);

    // Click-outside listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifIconRef.current && !notifIconRef.current.contains(event.target) &&
                notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
                setShowNotifDropdown(false);
            }
            if (profileIconRef.current && !profileIconRef.current.contains(event.target) &&
                profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    const handleBellClick = async (e) => {
        e.preventDefault();
        setShowNotifDropdown(!showNotifDropdown);
        setShowProfileDropdown(false); 
        if (!showNotifDropdown && unreadCount > 0) {
            setUnreadCount(0); 
            const endpoint = role === 'LIBRARIAN' 
                ? 'https://lms-backend-0jw8.onrender.com/api/admin/my-notifications/mark-read'
                : 'https://lms-backend-0jw8.onrender.com/api/user/my-notifications/mark-read';
            try {
                await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
            } catch (err) { console.error("Error marking read:", err); }
        }
    };
    
    const handleProfileClick = async (e) => {
        e.preventDefault();
        setShowProfileDropdown(!showProfileDropdown);
        setShowNotifDropdown(false); 
        
        if (!profileData && token) {
            try {
                const res = await axios.get('https://lms-backend-0jw8.onrender.com/api/auth/my-profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(res.data);
            } catch (err) { console.error("Failed to fetch profile", err); }
        }
    };

    const handleLogout = () => {
        toast.success("Signed out successfully!");
        logout();
    };
    
    const handleMobileLinkClick = () => {
        setShowMobileMenu(false);
    };

    // Handle Password Change Submit
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://lms-backend-0jw8.onrender.com/api/admin/change-password', passData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Password Changed Successfully!");
            setShowPasswordModal(false);
            setPassData({ oldPassword: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data || "Failed to change password.");
        }
    };
    
    const displayRole = profileData ? (profileData.role === 'LIBRARIAN' ? 'Admin' : 'User') : (role === 'LIBRARIAN' ? 'Admin' : 'User');

    return (
        <>
            <header className="app-header">
                <div className="navbar-content-wrapper">
                    
                    <Link to={role === 'LIBRARIAN' ? '/admin/dashboard' : '/dashboard'} className="logo-area" style={{ padding: '0 15px' }}>
                        <img 
                            src="/Bhadrak.png" 
                            alt="Bhadrak Library Logo" 
                            style={{ height: '50px', width: '50px', objectFit: 'contain', borderRadius: '50%' }} 
                        />
                        
                    </Link>
                    
                    <ul className="app-nav">
                        {role === 'LIBRARIAN' && (
                            <>
                                <li><Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link></li>
                                <li><Link to="/admin/borrowed-books" className={isActive('/admin/borrowed-books')}>Borrowed Books</Link></li>
                                <li><Link to="/admin/manage-books" className={isActive('/admin/manage-books')}>Add Book</Link></li>
                                <li><Link to="/admin/all-books" className={isActive('/admin/all-books')}>Library Collection</Link></li>
                                <li><Link to="/admin/manage-members" className={isActive('/admin/manage-members')}>Manage Members</Link></li>
                                <li><Link to="/admin/issue-book" className={isActive('/admin/issue-book')}>Issue / Return</Link></li>
                                <li><Link to="/admin/manage-fines" className={isActive('/admin/manage-fines')}>Manage Fines</Link></li>
                            </>
                        )}
                        {role === 'USER' && (
                            <>
                                <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
                                <li><Link to="/book-vault" className={isActive('/book-vault')}><FiSearch /> Book Vault</Link></li>
                                <li><Link to="/my-books" className={isActive('/my-books')}><RiBookmarkLine /> My Books</Link></li>
                                <li><Link to="/my-fines" className={isActive('/my-fines')}><RiWalletLine /> My Fines</Link></li>
                                <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
                            </>
                        )}
                    </ul>
                    
                    <div className="app-header-actions">
                        <div className="icon-wrapper" onClick={toggleTheme} title="Toggle Dark Mode">
                            {theme === 'light' ? <FiMoon /> : <FiSun />}
                        </div>

                        <div className="notification-container">
                            <div className="icon-wrapper" ref={notifIconRef} onClick={handleBellClick}>
                                <FiBell />
                                {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
                            </div>
                            <div ref={notifDropdownRef} className={`notification-dropdown ${showNotifDropdown ? 'show' : ''}`}>
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

                        <div className="profile-container">
                            <div className="icon-wrapper" ref={profileIconRef} onClick={handleProfileClick}>
                                <FiUser />
                            </div>
                            <div ref={profileDropdownRef} className={`profile-dropdown ${showProfileDropdown ? 'show' : ''}`}>
                                <div className="profile-item" onClick={() => { setShowProfileModal(true); setShowProfileDropdown(false); }}>
                                    <FiCreditCard /> My Profile
                                </div>
                                {role === 'LIBRARIAN' && (
                                    <div className="profile-item" onClick={() => { setShowPasswordModal(true); setShowProfileDropdown(false); }}>
                                        <FiLock /> Change Password
                                    </div>
                                )}
                                <div className="profile-item" onClick={handleLogout}>
                                    <FiLogOut /> Sign Out
                                </div>
                            </div>
                        </div>

                        <button className="mobile-menu-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                            {showMobileMenu ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>
            </header>

            {/* --- Mobile Menu Dropdown --- */}
            <div className={`mobile-nav-dropdown ${showMobileMenu ? 'show' : ''}`}>
                <ul className="app-nav">
                     {role === 'LIBRARIAN' && (
                        <>
                            <li onClick={handleMobileLinkClick}><Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/admin/borrowed-books" className={isActive('/admin/borrowed-books')}>Borrowed Books</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/admin/manage-books" className={isActive('/admin/manage-books')}>Add Book</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/admin/all-books" className={isActive('/admin/all-books')}>Library Collection</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/admin/manage-members" className={isActive('/admin/manage-members')}>Manage Members</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/admin/issue-book" className={isActive('/admin/issue-book')}>Issue / Return</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/admin/manage-fines" className={isActive('/admin/manage-fines')}>Manage Fines</Link></li>
                        </>
                    )}
                    {role === 'USER' && (
                        <>
                            <li onClick={handleMobileLinkClick}><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/book-vault" className={isActive('/book-vault')}>Book Vault</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/my-books" className={isActive('/my-books')}>My Books</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/my-fines" className={isActive('/my-fines')}>My Fines</Link></li>
                            <li onClick={handleMobileLinkClick}><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
                        </>
                    )}
                </ul>
            </div>

            {/* --- Profile Modal --- */}
            {showProfileModal && (
                <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-avatar"><FiUser /></div>
                        <h2>{profileData ? profileData.name : (username || 'User')}</h2>
                        <p style={{color:'var(--text-muted)', marginBottom:'1rem', textTransform: 'capitalize'}}>
                            {displayRole}
                        </p>
                        <div style={{textAlign:'left', background: theme === 'dark' ? '#334155' : '#f8fafc', padding:'1rem', borderRadius:'10px'}}>
                            {profileData ? (
                                <>
                                    <p style={{display:'flex', alignItems:'center', gap:'10px', marginBottom: '0.5rem'}}><RiUserStarLine /> <strong>Name:</strong> {profileData.name}</p>
                                    <p style={{display:'flex', alignItems:'center', gap:'10px', marginBottom: '0.5rem'}}><FiUser /> <strong>Username:</strong> {profileData.username}</p>
                                    <p style={{display:'flex', alignItems:'center', gap:'10px', marginBottom: '0.5rem'}}><FiMail /> <strong>Email:</strong> {profileData.email || 'N/A'}</p>
                                    <p style={{display:'flex', alignItems:'center', gap:'10px', marginBottom: '0.5rem'}}><FiPhone /> <strong>Mobile:</strong> {profileData.mobileNumber || 'N/A'}</p>
                                    <p style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        {profileData.role === 'LIBRARIAN' ? <FiShield /> : <FiUser />}
                                        <strong>Role:</strong> {displayRole}
                                    </p>
                                </>
                            ) : (
                                <p>Loading profile details...</p>
                            )}
                        </div>
                        <button className="btn-primary" style={{marginTop:'1.5rem'}} onClick={() => setShowProfileModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {/* --- Change Password Modal --- */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <h2>Change Password</h2>
                            <FiX style={{cursor:'pointer', fontSize:'1.5rem'}} onClick={() => setShowPasswordModal(false)}/>
                        </div>
                        <form onSubmit={handlePasswordSubmit} style={{marginTop: '1rem'}}>
                            <div className="input-group">
                                <label>Current Password</label>
                                <input type="password" value={passData.oldPassword} onChange={e => setPassData({...passData, oldPassword: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>New Password</label>
                                <input type="password" value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>Update Password</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;