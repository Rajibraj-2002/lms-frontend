// src/pages/ManageFines.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const ManageFines = () => {
    const { token } = useAuth();
    const [fines, setFines] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    
    // State for the manual fine form
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        amount: '',
        reason: ''
    });

    useEffect(() => {
        if (!token) return;
        
        const fetchFines = async () => {
            try {
                const res = await axios.get('https://lms-backend-production-d950.up.railway.app/api/admin/fines/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFines(res.data);
            } catch (err) { console.error("Error fetching fines:", err); }
        };
        
        const fetchMembers = async () => {
            try {
                const res = await axios.get('https://lms-backend-production-d950.up.railway.app/api/admin/users/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMembers(res.data.filter(u => u.role === 'USER')); 
            } catch (err) { 
                console.error("Error fetching members:", err); 
            }
        };

        fetchFines();
        fetchMembers();
    }, [token, refreshKey]);

    // --- FIX: UPDATED PAY FUNCTION ---
    const handlePayFine = async (fineId) => {
        try {
            await axios.post(`https://lms-backend-production-d950.up.railway.app/api/admin/fines/pay?fineId=${fineId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Fine marked as PAID!");
            
            // 1. Instantly remove the item from the list (Visual Fix)
            setFines(prevFines => prevFines.filter(fine => fine.id !== fineId));
            
            // 2. Trigger background refresh
            setRefreshKey(oldKey => oldKey + 1); 
        } catch (err) {
            toast.error(err.response?.data || "Failed to pay fine.");
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleManualFineSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://lms-backend-production-d950.up.railway.app/api/admin/fines/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Manual fine added successfully!");
            setFormData({ username: '', amount: '', reason: '' }); 
            setRefreshKey(oldKey => oldKey + 1); 
        } catch (err) {
            toast.error(err.response?.data || "Failed to add fine.");
        }
    };

    return (
        <div>
            <Helmet>
                <title>Manage Fines - LMS Prime</title>
            </Helmet>
            <header className="main-header"><h1>Manage Fines</h1></header>

            <div className="manage-layout">
                {/* Manual Fine Form */}
                <div className="glass-card panel panel-form">
                    <h3>Add Manual Fine</h3>
                    <form onSubmit={handleManualFineSubmit} className="stacked-form">
                        <div className="input-group">
                            <label>Username</label>
                            <select 
                                name="username"
                                value={formData.username}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="">-- Select a Member --</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.username}>
                                        {member.name} ({member.username})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Amount (₹)</label>
                            <input 
                                type="number" 
                                name="amount"
                                value={formData.amount}
                                onChange={handleFormChange}
                                placeholder="e.g., 50.00"
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <label>Reason</label>
                            <input 
                                type="text" 
                                name="reason"
                                value={formData.reason}
                                onChange={handleFormChange}
                                placeholder="e.g., Damaged book"
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{marginTop: '1rem'}}>
                            Apply Fine
                        </button>
                    </form>
                </div>
                
                {/* Fines List */}
                <div className="glass-card panel panel-list">
                    <h3>Outstanding Fines</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Reason / Book</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fines.length === 0 ? (
                                    <tr className="empty-row"><td colSpan="4">No outstanding fines.</td></tr>
                                ) : (
                                    fines.map(fine => (
                                        <tr key={fine.id}>
                                            <td>
                                                <strong>{fine.userName}</strong>
                                            </td>
                                            <td>
                                                {fine.bookTitle ? (
                                                    <span>Overdue: <em>{fine.bookTitle}</em></span>
                                                ) : (
                                                    <span>{fine.reason}</span>
                                                )}
                                            </td>
                                            <td className="status-overdue">₹{fine.amount.toFixed(2)}</td>
                                            <td>
                                                <button 
                                                    className="button-success" 
                                                    onClick={() => handlePayFine(fine.id)}
                                                >
                                                    Mark as Paid
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageFines;