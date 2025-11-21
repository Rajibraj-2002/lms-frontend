// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader'; 
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { FiUsers, FiBook, FiExternalLink, FiAlertTriangle, FiSearch, FiRepeat } from 'react-icons/fi';

const AdminDashboard = () => {
    const { token } = useAuth(); 
    const [stats, setStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null); 

    useEffect(() => {
        if (!token) return; 
        const fetchStats = async () => {
            try {
                const response = await axios.get('https://lms-backend-production-d950.up.railway.app/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) { 
                console.error("Failed to fetch stats:", err); 
            }
        };
        fetchStats();
    }, [token]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        const toastId = toast.loading('Searching...');
        try {
            const res = await axios.get(`https://lms-backend-production-d950.up.railway.app/api/admin/books/search?query=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSearchResults(res.data);
            toast.success('Search complete!', { id: toastId });
        } catch (err) { 
            console.error(err);
            toast.error('Search failed.', { id: toastId });
        }
    };

    return (
        <div>
            <Helmet>
                <title>Admin Dashboard - LMS Prime</title>
            </Helmet>
            <PageHeader title="Admin Dashboard" subtitle="Here is what is happening in your library." />

            {/* --- BENTO GRID LAYOUT --- */}
            <div className="bento-grid">
                
                {/* --- Row 1: KPI Stats --- */}
                <div className="bento-box bento-span-1">
                    <p className="stat-label">Total Members</p>
                    <p className="stat-number">{stats ? stats.totalMembers : '...'}</p>
                </div>
                <div className="bento-box bento-span-1">
                    <p className="stat-label">Total Books</p>
                    <p className="stat-number">{stats ? stats.totalBooks : '...'}</p>
                </div>
                <div className="bento-box bento-span-1">
                    <p className="stat-label">Books on Loan</p>
                    <p className="stat-number">{stats ? stats.booksOnLoan : '...'}</p>
                </div>
                <div className="bento-box bento-span-1">
                    <p className="stat-label">Unpaid Fines</p>
                    <p className="stat-number" style={{color: 'var(--danger-color)'}}>
                        {stats ? `₹${stats.totalFinesAmount.toFixed(2)}` : '...'}
                    </p>
                </div>

                {/* --- Row 2: Search Card (Spans 2 columns) --- */}
                <div className="bento-box bento-span-2">
                    <h3 style={{marginBottom: '1rem', display:'flex', alignItems:'center', gap:'10px'}}>
                        <FiSearch className="search-header-icon"/> Check Book Availability
                    </h3>
                    <form onSubmit={handleSearch} className="search-container">
                        <input 
                            type="text" 
                            placeholder="Enter Book Name or ISBN..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="btn-primary">Search</button>
                    </form>
                    
                    {searchResults !== null && (
                        <div className="table-container" style={{marginTop: '1rem'}}>
                            <table className="data-table">
                                <thead><tr><th>Title</th><th>Author</th><th>Available</th></tr></thead>
                                <tbody>
                                    {searchResults.length === 0 ? (
                                        <tr className="empty-row"><td colSpan="3">No matches.</td></tr>
                                    ) : (
                                        searchResults.map(b => (
                                            <tr key={b.id}>
                                                <td>{b.title}</td>
                                                <td>{b.author}</td>
                                                <td>
                                                    <span className={b.availableCopies > 0 ? 'badge badge-success' : 'badge badge-danger'}>
                                                        {b.availableCopies} Left
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* --- Row 2 (Continued): Large Action Panel --- */}
                <Link to="/admin/issue-book" className="action-card bento-span-2 bento-row-span-2" style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <div style={{display:'flex', alignItems: 'center', gap: '10px'}}>
                        <div className="card-icon" style={{backgroundColor: '#FFE5EC'}}><FiRepeat style={{color: 'var(--secondary)'}} /></div>
                        <h3>Issue / Return</h3>
                    </div>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'left'}}>
                        Manage all book loans and returns for members.
                    </p>
                </Link>
                
                {/* --- Row 3: Utility Links --- */}
                <Link to="/admin/all-books" className="action-card bento-span-1">
                    <div className="card-icon"><FiBook /></div>
                    <h3>Library Collection</h3>
                </Link>
                <Link to="/admin/manage-members" className="action-card bento-span-1">
                    <div className="card-icon"><FiUsers /></div>
                    <h3>Manage Members</h3>
                </Link>
                <Link to="/admin/manage-fines" className="action-card bento-span-1">
                    <div className="card-icon"><FiAlertTriangle /></div>
                    <h3>Manage Fines</h3>
                </Link>
                <Link to="/admin/borrowed-books" className="action-card bento-span-1">
                    <div className="card-icon"><FiExternalLink /></div>
                    <h3>View All Loans</h3>
                </Link>
            </div>
            {/* --- END BENTO GRID --- */}
        </div>
    );
};

export default AdminDashboard;