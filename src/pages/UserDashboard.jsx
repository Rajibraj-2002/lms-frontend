// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import BookSlider from '../components/BookSlider';
import { FiBookOpen, FiAlertCircle, FiSearch } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const UserDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({ books: 0, fines: 0.0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    // We still fetch books to get the *count* for the stat card
                    const [booksRes, finesRes] = await Promise.all([
                        axios.get('https://lms-backend-0jw8.onrender.com/api/user/my-books', { headers: { Authorization: `Bearer ${token}` } }),
                        axios.get('https://lms-backend-0jw8.onrender.com/api/user/my-fines', { headers: { Authorization: `Bearer ${token}` } }),
                    ]);
                    const totalFine = finesRes.data.reduce((acc, curr) => acc + curr.amount, 0);
                    setStats({ books: booksRes.data.length, fines: totalFine });
                } catch (err) { console.error(err); }
                finally { setIsLoading(false); }
            };
            fetchData();
        }
    }, [token]);

    return (
        <div>
            <Helmet>
                <title>Dashboard - LMS Prime</title>
            </Helmet>
            <PageHeader title="My Dashboard" />

            {/* --- Stats Cards --- */}
            <div className="action-grid">
                <div className="action-card">
                    <div className="card-icon"><FiBookOpen /></div>
                    <h3>{isLoading ? '...' : stats.books}</h3>
                    <p style={{color: 'var(--text-muted)'}}>Books Borrowed</p>
                </div>
                <div className="action-card">
                    <div className="card-icon" style={{color: stats.fines > 0 ? 'var(--danger-color)' : 'var(--primary)'}}><FaRupeeSign /></div>
                    <h3 style={{color: stats.fines > 0 ? 'var(--danger-color)' : 'inherit'}}>
                        {isLoading ? '...' : `₹${stats.fines.toFixed(2)}`}
                    </h3>
                    <p style={{color: 'var(--text-muted)'}}>Unpaid Fines</p>
                </div>
                <div className="action-card">
                    <div className="card-icon"><FiAlertCircle /></div>
                    <h3>{isLoading ? '...' : (stats.fines > 0 ? 'Action Required' : 'Good Standing')}</h3>
                    <p style={{color: 'var(--text-muted)'}}>Status</p>
                </div>
            </div>

            {/* --- "My Borrowed Books" Table is REMOVED --- */}

            {/* --- New Arrivals --- */}
            <div className="glass-card panel" style={{padding: '0'}}>
                <h3 style={{padding: '2rem 2rem 0 2rem'}}>New Arrivals</h3>
                <BookSlider />
            </div>
        </div>
    );
};

export default UserDashboard;