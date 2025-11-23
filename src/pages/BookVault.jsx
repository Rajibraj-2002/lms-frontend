// src/pages/BookVault.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

const IMAGE_BASE_URL = 'https://lms-backend-0jw8.onrender.com'; // Ensure this matches your live backend

const BookVault = () => {
    const { token } = useAuth(); 
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);

    // Debounce and search logic
    useEffect(() => {
        setIsLoading(true);
        const handler = setTimeout(async () => {
            const query = searchTerm.length > 2 ? searchTerm : '';
            const endpoint = query ? `/api/public/books/search?query=${query}` : '/api/public/books/all';
            
            try {
                const res = await axios.get(`${IMAGE_BASE_URL}${endpoint}`);
                setBooks(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Could not load books.");
            }
            setIsLoading(false);
        }, 500); 

        return () => { clearTimeout(handler); }; 
    }, [searchTerm]);

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    const handleWishToBorrow = async () => {
        try {
            await axios.post(`${IMAGE_BASE_URL}/api/user/request-borrow`, 
                { bookId: selectedBook.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Request sent to librarian!");
        } catch (err) {
            toast.error(err.response?.data || "Failed to send request.");
        }
        setSelectedBook(null);
    };

    const handleNotifyMe = async () => {
        try {
            await axios.post(`${IMAGE_BASE_URL}/api/user/waitlist/add`, 
                { bookId: selectedBook.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Done! We'll notify you when it's back in stock.");
        } catch (err) {
            toast.error(err.response?.data || "Failed to add to waitlist.");
        }
        setSelectedBook(null);
    };

    return (
        <div>
            <Helmet> <title>Book Vault - LMS Prime</title> </Helmet>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <header className="main-header" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                    <h1>Book Vault</h1>
                    <p style={{color: 'var(--text-muted)'}}>Browse and search our entire collection.</p>
                </header>
                
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
            
            <div className="book-vault-grid">
                {isLoading ? (
                    <p style={{color: 'var(--text-muted)'}}>Loading books...</p>
                ) : books.length === 0 ? (
                    <p style={{color: 'var(--text-muted)'}}>No books match your search.</p>
                ) : (
                    books.map(book => (
                        <div className="book-card" key={book.id} onClick={() => handleBookClick(book)}>
                            <img 
                                src={book.coverImageUrl} 
                                alt={book.title} 
                                className="book-card-image"
                                // --- FIX: Replaced via.placeholder.com with placehold.co ---
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300?text=No+Cover"; }}
                            />
                            <div className="book-card-content">
                                <h3>{book.title}</h3>
                                <p>{book.description || "No description available."}</p>
                                <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                                    {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'On Loan'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- Book Details Modal --- */}
            {selectedBook && (
                <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
                    <div className="modal-card" style={{textAlign: 'left', maxWidth: '600px'}} onClick={e => e.stopPropagation()}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h2>{selectedBook.title}</h2>
                            <button onClick={() => setSelectedBook(null)} style={{background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)'}}><FiX /></button>
                        </div>
                        <p style={{color: 'var(--text-muted)', marginBottom: '1rem'}}>by {selectedBook.author}</p>
                        
                        <div style={{display: 'flex', gap: '1.5rem'}}>
                            <img 
                                src={selectedBook.coverImageUrl} 
                                alt={selectedBook.title} 
                                className="book-card-image"
                                style={{width: '150px', height: '220px'}}
                                // --- FIX: Replaced via.placeholder.com with placehold.co ---
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x220?text=No+Cover"; }}
                            />
                            <div style={{flex: 1}}>
                                <div className="modal-book-description">
                                    <p>{selectedBook.description || "No description available for this title."}</p>
                                </div>
                                <hr style={{margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border-color)'}} />
                                <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                                <p><strong>Status:</strong> 
                                    <span className={`badge ${selectedBook.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`} style={{marginLeft: '10px'}}>
                                        {selectedBook.availableCopies > 0 ? `${selectedBook.availableCopies} Available` : 'On Loan'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem'}}>
                            {selectedBook.availableCopies > 0 ? (
                                <button className="btn-primary" onClick={handleWishToBorrow}>Wish to Borrow</button>
                            ) : (
                                <button className="btn-primary" onClick={handleNotifyMe}>Notify Me When Available</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookVault;