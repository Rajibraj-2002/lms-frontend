// src/pages/ManageMembers.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; 
import { FiEdit2, FiSearch, FiTrash2 } from 'react-icons/fi'; // 1. Import FiTrash2

const ManageMembers = () => {
    const { token } = useAuth();
    const [members, setMembers] = useState([]);
    
    const [editingUser, setEditingUser] = useState(null); 
    const [formData, setFormData] = useState({ 
        name: '', mobileNumber: '', email: '', username: '', password: '' 
    });
    const [refreshKey, setRefreshKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!token) return; 
        const fetchMembers = async () => {
            try {
                const res = await axios.get('https://lms-backend-0jw8.onrender.com/api/admin/users/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMembers(res.data.filter(u => u.role === 'USER'));
            } catch (err) { 
                console.error("Error fetching members:", err); 
            }
        };
        fetchMembers();
    }, [token, refreshKey]);

    const filteredMembers = useMemo(() => {
        if (!searchTerm) return members; 
        return members.filter(member => 
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [members, searchTerm]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const clearForm = () => {
        setFormData({ name: '', mobileNumber: '', email: '', username: '', password: '' });
        setEditingUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await axios.put(`https://lms-backend-0jw8.onrender.com/api/admin/users/update/${editingUser.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Member updated successfully!");
            } else {
                await axios.post('https://lms-backend-0jw8.onrender.com/api/admin/users/create', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Member added successfully!");
            }
            clearForm();
            setRefreshKey(oldKey => oldKey + 1);
        } catch (err) { 
            console.error("Error saving member:", err);
            toast.error(err.response?.data || "Error saving member."); 
        }
    };

    const handleEditClick = (member) => {
        setEditingUser(member);
        setFormData({
            name: member.name,
            mobileNumber: member.mobileNumber || '',
            email: member.email || '',
            username: member.username,
            password: '' 
        });
    };

    // --- NEW: DELETE HANDLER ---
    const handleDeleteClick = async (memberId) => {
        if (!window.confirm("Are you sure you want to delete this member? This cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(`https://lms-backend-0jw8.onrender.com/api/admin/users/delete/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Member deleted successfully.");
            setRefreshKey(oldKey => oldKey + 1); // Refresh list
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(err.response?.data || "Could not delete member.");
        }
    };

    return (
        <div>
            <header className="main-header"><h1>Manage Members</h1></header>
            
            <div className="manage-layout">
                <div className="glass-card panel panel-form">
                    <h3>{editingUser ? 'Update Member' : 'Add New Member'}</h3>
                    <form onSubmit={handleSubmit} className="horizontal-form">
                        <div className="input-group">
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Mobile</label>
                            <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
                        </div>
                        <div className="input-group" style={{gridColumn: 'span 2'}}>
                            <label>Password {editingUser && '(Leave blank to keep current)'}</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editingUser} />
                        </div>
                        <div className="form-button-area">
                            <button type="submit" className="btn-primary">
                                {editingUser ? 'Update Account' : 'Create Account'}
                            </button>
                            {editingUser && (
                                <button type="button" className="btn-secondary" onClick={clearForm}>
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="glass-card panel panel-list">
                    <div className="panel-header">
                        <h3>Registered Members</h3>
                        <div className="search-container">
                            <FiSearch />
                            <input 
                                type="text" 
                                placeholder="Search by name..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.length === 0 ? (
                                    <tr className="empty-row"><td colSpan="5">No members found.</td></tr>
                                ) : (
                                    filteredMembers.map(m => (
                                        <tr key={m.id}>
                                            <td>{m.name}</td>
                                            <td>{m.username}</td>
                                            <td>{m.email}</td>
                                            <td>{m.mobileNumber}</td>
                                            <td style={{display: 'flex', gap: '10px'}}>
                                                <button 
                                                    className="button-success" 
                                                    onClick={() => handleEditClick(m)}
                                                    style={{padding: '6px 10px'}}
                                                    title="Edit User"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                
                                                {/* --- NEW: DELETE BUTTON --- */}
                                                <button 
                                                    className="button-danger" 
                                                    onClick={() => handleDeleteClick(m.id)}
                                                    style={{padding: '6px 10px'}}
                                                    title="Delete User"
                                                >
                                                    <FiTrash2 />
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
export default ManageMembers;