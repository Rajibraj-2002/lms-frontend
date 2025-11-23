// src/components/BookSlider.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookSlider.css';

// We don't need IMAGE_BASE_URL for images anymore because Cloudinary gives the full link.
const API_BASE_URL = 'https://lms-backend-0jw8.onrender.com';

const BookSlider = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/public/books/latest`); 
                setBooks([...res.data, ...res.data]); // Duplicate for infinite scroll effect
            } catch (err) { console.error("Error fetching books:", err); }
        };
        fetchBooks();
    }, []); 

    return (
        <div className="book-slider-container">
            <div className="book-slider-track">
                {books.length === 0 ? (
                    <div className="empty-carousel-message" style={{width: '100%', textAlign: 'center'}}>
                        No books available to display.
                    </div>
                ) : (
                    books.map((book, index) => (
                        <div className="book-slide-item" key={index}>
                            <div className="book-placeholder-cover">
                                {/* --- FIX: Use book.coverImageUrl DIRECTLY (No Prefix) --- */}
                                <img 
                                    src={book.coverImageUrl} 
                                    alt={book.title} 
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x300?text=No+Cover"; }} 
                                />
                                <div className="book-info">
                                    <span className="book-title-overlay">{book.title}</span>
                                    <span className="book-author-overlay">{book.author}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookSlider;