// src/pages/MyFines.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const MyFines = () => {
    const { token } = useAuth();
    const [fines, setFines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const finesRes = await axios.get('https://lms-backend-0jw8.onrender.com/api/user/my-fines', { headers: { Authorization: `Bearer ${token}` } });
                    setFines(finesRes.data);
                } catch (err) { console.error(err); }
                finally { setIsLoading(false); }
            };
            fetchData();
        }
    }, [token]);

    const totalFine = fines.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div>
            <Helmet>
                <title>My Fines - LMS Prime</title>
            </Helmet>
            {/* --- FIX: Use simple header, not PageHeader component --- */}
            <header className="main-header">
                <h1>My Fines</h1>
                <p style={{color: 'var(--text-muted)'}}>All outstanding fines must be paid to the librarian.</p>
            </header>
            
            <div className="glass-card panel">
                <h3 style={{marginBottom:'1rem'}}>Total Due: 
                    <span style={{color: totalFine > 0 ? 'var(--danger-color)' : 'var(--success-color)', marginLeft: '1rem'}}>
                        ₹{totalFine.toFixed(2)}
                    </span>
                </h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead><tr><th>Book Title</th><th>Status</th><th>Amount</th></tr></thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="empty-row"><td colSpan="3">Loading...</td></tr>
                            ) : fines.length === 0 ? (
                                <tr className="empty-row"><td colSpan="3">No outstanding fines.</td></tr>
                            ) : (
                                fines.map((fine, index) => (
                                    <tr key={index}>
                                        <td>{fine.bookTitle}</td>
                                        <td><span className="badge badge-danger">{fine.status}</span></td>
                                        <td className="status-overdue">₹{fine.amount.toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default MyFines;