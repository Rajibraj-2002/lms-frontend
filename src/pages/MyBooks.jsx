// src/pages/MyBooks.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { Helmet } from 'react-helmet-async';

const MyBooks = () => {
    const { token } = useAuth();
    const [myBooks, setMyBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const booksRes = await axios.get('https://lms-backend-0jw8.onrender.com/api/user/my-books', { headers: { Authorization: `Bearer ${token}` } });
                    setMyBooks(booksRes.data);
                } catch (err) { console.error(err); }
                finally { setIsLoading(false); }
            };
            fetchData();
        }
    }, [token]);

    return (
        <div>
            <Helmet>
                <title>My Borrowed Books - LMS Prime</title>
            </Helmet>
            <PageHeader title="My Borrowed Books" />
            
            <div className="glass-card panel">
                <h3 style={{marginBottom:'1rem'}}>A list of your active and overdue loans.</h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead><tr><th>Book Title</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="empty-row"><td colSpan="4">Loading...</td></tr>
                            ) : myBooks.length === 0 ? (
                                <tr className="empty-row"><td colSpan="4">You have no borrowed books.</td></tr>
                            ) : (
                                myBooks.map((book, index) => {
                                    const isOverdue = new Date(book.dueDate) < new Date();
                                    return (
                                        <tr key={index}>
                                            {/* --- FIX IS HERE: Changed book.bookTitle to book.title --- */}
                                            <td>{book.title}</td>
                                            <td>{book.issueDate}</td>
                                            <td style={{color: isOverdue ? 'var(--danger-color)' : 'inherit'}}>{book.dueDate}</td>
                                            <td><span className={`badge ${isOverdue ? 'badge-danger' : 'badge-success'}`}>{isOverdue ? 'Late' : 'Active'}</span></td>
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
export default MyBooks;