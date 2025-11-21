// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { FiSun, FiMoon, FiX } from 'react-icons/fi';
import './Login.css'; 

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'USER' });
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme(); 
    
    // State for Reset Modal
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetData, setResetData] = useState({ username: '', adminKey: '', newPassword: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://lms-backend-production-d950.up.railway.app/api/auth/login', formData);
            if (res.data.role.toUpperCase() !== formData.role) {
                toast.error(`Role mismatch!`); 
                return;
            }
            login(res.data.jwt, res.data.role);
            toast.success(`Welcome back!`);
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Invalid Credentials");
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://lms-backend-production-d950.up.railway.app/api/auth/reset-password', resetData);
            toast.success("Password Reset Successfully! Please login.");
            setShowResetModal(false);
            setResetData({ username: '', adminKey: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data || "Reset failed.");
        }
    }

    return (
        <div className="login-page-body">
            <Helmet>
                <title>LMS Prime - Login</title>
                <meta name="description" content="Sign in to the Library Management System." />
            </Helmet>

            {/* Left Side (Logo) */}
            <div className="split-left">
                <div className="brand-content">
                    <img src="/Bhadrak.png" alt="Bhadrak Library Logo" className="brand-logo-large" />
                    <h1>Bhadrak Library</h1>
                    <p>Your complete solution for modern library management.</p>
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className="split-right">
                <div className="login-card">
                    <div 
                        className="theme-toggle-wrapper" 
                        onClick={toggleTheme} 
                        title="Toggle Dark Mode" 
                        style={{position: 'absolute', top: '2rem', right: '2rem', background: 'var(--bg-color)'}}
                    >
                        {theme === 'light' ? <FiMoon /> : <FiSun />}
                    </div>

                    <h2 style={{marginBottom:'1.5rem', fontWeight:'600', color: 'var(--text-main)'}}>Sign In</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>I am a...</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="USER">Student / Member</option>
                                <option value="LIBRARIAN">Librarian / Admin</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" name="username" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" name="password" onChange={handleChange} required />
                        </div>
                        
                        <div style={{textAlign: 'right', marginBottom: '1rem'}}>
                            <span onClick={() => setShowResetModal(true)} style={{color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600'}}>
                                Forgot Password?
                            </span>
                        </div>

                        <button type="submit" className="btn-primary">Access Dashboard</button>
                    </form>
                    
                    <div className="login-links">
                        <p>Need an account?</p>
                        <Link to="/register-librarian">
                            Librarian Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- RESET PASSWORD MODAL --- */}
            {showResetModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }} onClick={() => setShowResetModal(false)}>
                    
                    <div className="login-card" style={{maxWidth: '400px', position: 'relative'}} onClick={e => e.stopPropagation()}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                            <h2 style={{fontSize: '1.5rem', margin: 0}}>Reset Password</h2>
                            <button onClick={() => setShowResetModal(false)} style={{background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)'}}><FiX /></button>
                        </div>
                        <p style={{color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem'}}>
                            Enter your Username and the System Admin Key to reset your password.
                        </p>
                        
                        <form onSubmit={handleResetSubmit}>
                            <div className="input-group">
                                <label>Username</label>
                                <input type="text" value={resetData.username} onChange={e => setResetData({...resetData, username: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Admin Authorization Key</label>
                                <input type="password" value={resetData.adminKey} onChange={e => setResetData({...resetData, adminKey: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>New Password</label>
                                <input type="password" value={resetData.newPassword} onChange={e => setResetData({...resetData, newPassword: e.target.value})} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{marginTop: '1rem'}}>Reset Password</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Login;