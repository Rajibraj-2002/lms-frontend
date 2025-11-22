// src/pages/RegisterLibrarian.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { FiSun, FiMoon } from 'react-icons/fi';
import './Login.css'; // <-- 1. Import the same new CSS

const RegisterLibrarian = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({
        authorizationKey: '', name: '', librarianId: '',
        email: '', username: '', password: '', confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }
        try {
            await axios.post('https://lms-backend-0jw8.onrender.com/api/auth/register/librarian', formData);
            toast.success("Registration Successful! Please log in.");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data || "Registration failed.");
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 2. Use the new CSS classes
        <div className="login-page-body">
            <Helmet>
                <title>LMS Prime - Librarian Sign Up</title>
                <meta name="description" content="Register a new librarian account." />
            </Helmet>

            {/* Left Side (Logo) */}
            <div className="split-left">
                <div className="brand-content">
                    <img src="/Bhadrak.png" alt="Library Logo" className="brand-logo-large" />
                    <h1>LMS Prime</h1>
                    <p>Your complete solution for modern library management.</p>
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className="split-right">
                <div className="login-card">
                    {/* Dark mode toggle */}
                    <div 
                        className="icon-wrapper" 
                        onClick={toggleTheme} 
                        title="Toggle Dark Mode" 
                        style={{position: 'absolute', top: '2rem', right: '2rem', background: 'var(--bg-color)'}}
                    >
                        {theme === 'light' ? <FiMoon /> : <FiSun />}
                    </div>

                    <h2 style={{marginBottom:'1.5rem', fontWeight:'600', color: 'var(--text-main)'}}>Librarian Sign Up</h2>
                    
                    <form onSubmit={handleSubmit} className="stacked-form"> 
                        <div className="input-group">
                            <label>Authorization Key</label>
                            <input type="text" name="authorizationKey" placeholder="Enter Admin Key" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Name</label>
                            <input type="text" name="name" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Librarian ID</label>
                            <input type="text" name="librarianId" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" name="email" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" name="username" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" name="password" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading} style={{marginTop:'1rem'}}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="login-links">
                        <p>Already have an account?</p>
                        <Link to="/login">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLibrarian;