// src/pages/AllBooks.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

const AllBooks = () => {
    const { token } = useAuth();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuery, setCurrentQuery] = useState('');

    const fetchBooks = useCallback(async (query = '') => {
        if (!token) return;
        setIsLoading(true);
        const endpoint = query ? `/api/admin/books/search?query=${query}` : '/api/admin/books/all';
        
        try {
            const res = await axios.get(`https://lms-backend-production-d950.up.railway.app${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (err) { 
            console.error("Error fetching books:", err); 
            toast.error("Failed to load books from server.");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchBooks(currentQuery);
    }, [currentQuery, fetchBooks]); 

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm.length > 2) {
                fetchBooks(searchTerm); 
            } else if (searchTerm.length === 0 && currentQuery) {
                setCurrentQuery('');
            }
        }, 300); 
        return () => { clearTimeout(handler); };
    }, [searchTerm, currentQuery, fetchBooks]); 

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentQuery(searchTerm);
    };

    return (
        <div>
            {/* --- FIX: HEADER & SEARCH BAR (Top Right) --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <header className="main-header" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                    <h1>Library Collection</h1>
                    <p style={{color: 'var(--text-muted)'}}>Search and manage all books in the inventory.</p>
                </header>
                
                {/* Small Search Bar */}
                <div className="search-container" style={{ minWidth: '300px' }}>
                    <FiSearch style={{margin: '0 10px', fontSize: '1.2rem', color: 'var(--text-muted)'}} />
                    <input 
                        type="text" 
                        placeholder="Search by title or ISBN..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            {/* --- END HEADER --- */}
            
            <div className="glass-card panel panel-list">
                <h3>{currentQuery ? `Search Results for: "${currentQuery}"` : "All Books in Stock"}</h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Available</th></tr></thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="empty-row"><td colSpan="4">Loading books...</td></tr>
                            ) : books.length === 0 ? (
                                <tr className="empty-row"><td colSpan="4">No books found.</td></tr>
                            ) : (
                                books.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.isbn}</td>
                                        <td>{b.availableCopies}/{b.totalCopies}</td>
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
export default AllBooks;