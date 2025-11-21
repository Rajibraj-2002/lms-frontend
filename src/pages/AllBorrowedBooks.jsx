// src/pages/AllBorrowedBooks.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const AllBorrowedBooks = () => {
    const { token } = useAuth();
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/borrowed/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBorrowedBooks(response.data);
        } catch (err) { 
            console.error("Error fetching borrowed books:", err); 
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]); 

    return (
        <div>
            <Helmet>
                <title>Borrowed Books - LMS Prime</title>
            </Helmet>
            <header className="main-header">
                <h1>All Borrowed Books (Active)</h1>
                <p style={{color: 'var(--text-muted)'}}>A live feed of all books currently on loan.</p>
            </header>
            
            <div className="panel"> {/* Use panel class for Material Design */}
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Book Title</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="empty-row"><td colSpan="5">Loading...</td></tr>
                            ) : borrowedBooks.length === 0 ? (
                                <tr className="empty-row"><td colSpan="5">No books are currently on loan.</td></tr>
                            ) : (
                                borrowedBooks.map((item) => {
                                    const isOverdue = new Date(item.dueDate) < new Date();
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <strong>{item.userName}</strong> 
                                                <br/>
                                                <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>
                                                    ({item.userUsername})
                                                </span>
                                            </td>
                                            <td>{item.bookTitle}</td>
                                            <td>{item.issueDate}</td>
                                            <td style={{color: isOverdue ? 'var(--danger-color)' : 'inherit', fontWeight: isOverdue ? 'bold' : 'normal'}}>{item.dueDate}</td>
                                            <td>
                                                <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-success'}`}>
                                                    {isOverdue ? 'OVERDUE' : 'On-Loan'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllBorrowedBooks;