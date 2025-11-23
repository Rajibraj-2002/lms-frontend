// src/components/BookSlider.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookSlider.css';

const IMAGE_BASE_URL = 'https://lms-backend-0jw8.onrender.com';

const BookSlider = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get(`${IMAGE_BASE_URL}/api/public/books/latest`); 
                // FIX: Duplicate the list for a seamless loop
                setBooks([...res.data, ...res.data]); 
            } catch (err) { console.error("Error fetching books:", err); }
        };
        fetchBooks();
    }, []); 

    return (
        <div className="book-slider-container">
            {/* We no longer need the 'book-slider-stop' class */}
            <div className="book-slider-track">
                {books.length === 0 ? (
                    <div className="empty-carousel-message" style={{width: '100%', textAlign: 'center'}}>
                        No books available to display.
                    </div>
                ) : (
                    books.map((book, index) => (
                        <div className="book-slide-item" key={index}>
                            <div className="book-placeholder-cover">
                                <img 
                                    src={`${IMAGE_BASE_URL}${book.coverImageUrl}`} 
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