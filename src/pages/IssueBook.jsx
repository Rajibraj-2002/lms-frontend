// src/pages/IssueBook.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const IssueBook = () => {
    const { token } = useAuth();
    const [issueData, setIssueData] = useState({ isbn: '', username: '' });
    const [returnData, setReturnData] = useState({ isbn: '', username: '' });

    const handleIssue = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://lms-backend-0jw8.onrender.com/api/admin/books/issue', issueData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Book(s) Issued Successfully!");
            setIssueData({ isbn: '', username: '' });
        } catch (err) { 
            toast.error(err.response?.data || "Error issuing book(s)."); 
        }
    };

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://lms-backend-0jw8.onrender.com/api/admin/books/return', returnData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(res.data); 
            setReturnData({ isbn: '', username: '' });
        } catch (err) { 
            toast.error(err.response?.data || "Error returning book."); 
        }
    };

    return (
        <div>
            <header className="main-header"><h1>Issue & Return</h1></header>
            
            {/* --- FIX: Vertical Form Layout --- */}
            <div className="manage-layout">
                <div className="glass-card panel panel-form">
                    <h3>Issue Book(s)</h3>
                    <form onSubmit={handleIssue} className="stacked-form">
                        
                        {/* --- FIX: Changed to Textarea --- */}
                        <div className="input-group">
                            <label>ISBN(s)</label>
                            <textarea 
                                rows="3"
                                value={issueData.isbn} 
                                onChange={e => setIssueData({...issueData, isbn: e.target.value})} 
                                placeholder="Enter one or more ISBNs, separated by commas..."
                                required 
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" value={issueData.username} onChange={e => setIssueData({...issueData, username: e.target.value})} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{marginTop:'1rem'}}>Issue Book(s)</button>
                    </form>
                </div>
                
                <div className="glass-card panel panel-form">
                    <h3>Return Book</h3>
                    <form onSubmit={handleReturn} className="stacked-form">
                        <div className="input-group">
                            <label>ISBN</label>
                            <input type="text" value={returnData.isbn} onChange={e => setReturnData({...returnData, isbn: e.target.value})} required />
                        </div>
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" value={returnData.username} onChange={e => setReturnData({...returnData, username: e.target.value})} required placeholder="User returning the book" />
                        </div>
                        <button type="submit" className="btn-primary" style={{marginTop:'1rem'}}>Return Book</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default IssueBook;