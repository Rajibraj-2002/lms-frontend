// src/pages/ManageBooks.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const ManageBooks = () => {
    const { token } = useAuth();
    
    const [formData, setFormData] = useState({ isbn: '', title: '', author: '', totalCopies: '', description: '' });
    const [file, setFile] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // --- THIS IS THE MISSING FUNCTION ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // ------------------------------------

    // Autocomplete/Typeahead Logic
    useEffect(() => {
        if (!token || searchTerm.length < 2) {
            setSuggestions([]);
            return;
        }
        const handler = setTimeout(async () => {
            try {
                const res = await axios.get(`https://lms-backend-0jw8.onrender.com/api/public/books/search?query=${searchTerm}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuggestions(res.data);
            } catch (err) { console.error("Autocomplete error:", err); }
        }, 300); 

        return () => { clearTimeout(handler); };
    }, [searchTerm, token]); 

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) { toast.error("Please select a book cover image."); return; }

        const data = new FormData();
        data.append("file", file); 
        data.append("book", JSON.stringify(formData));

        try {
            await axios.post('https://lms-backend-0jw8.onrender.com/api/admin/books/add', data, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            
            toast.success(isUpdateMode ? "Book updated successfully!" : "Book added successfully!");
            clearForm();
            
        } catch (err) { 
            console.error("Error saving book:", err);
            toast.error(err.response?.data || "Error saving book."); 
        }
    };
    
    const clearForm = () => {
        setFormData({ isbn: '', title: '', author: '', totalCopies: '', description: '' });
        setFile(null);
        if (document.getElementById('file-input')) {
            document.getElementById('file-input').value = null; 
        }
        setIsUpdateMode(false);
    };

    const handleSuggestionClick = (book) => {
        setSearchTerm(''); 
        setSuggestions([]); 
        setFormData({
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            totalCopies: book.totalCopies,
            description: book.description || ''
        });
        setIsUpdateMode(true); 
        toast.info(`Editing "${book.title}". Please re-upload the cover photo to update it.`);
    };

    return (
        <div>
            <Helmet>
                <title>Add/Update Book - LMS Prime</title>
            </Helmet>
            <header className="main-header"><h1>Add / Update Book</h1></header>
            
            <div className="glass-card panel">
                
                <form onSubmit={handleSubmit} className="horizontal-form">
                    
                    {/* --- Row 1 (Full Width) --- */}
                    <div className="search-dropdown-wrapper" style={{gridColumn: 'span 2'}}> 
                        <label>Search Existing Book (to prefill/update)</label>
                        <div className="search-container">
                            <FiSearch style={{margin: '0 10px'}}/>
                            <input 
                                type="text" 
                                placeholder="Type ISBN or Title..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {suggestions.length > 0 && (
                            <div className="suggestions-dropdown">
                                {suggestions.map(book => (
                                    <div 
                                        key={book.id} 
                                        className="suggestion-item" 
                                        onClick={() => handleSuggestionClick(book)}
                                    >
                                        <strong>{book.title}</strong>
                                        <span className="suggestion-isbn">({book.isbn})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* --- Row 2 (Full Width Separator) --- */}
                    <h3 style={{gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem'}}>
                        {isUpdateMode ? "Update Book Details" : "Add New Book Details"}
                    </h3>

                    {/* --- Row 3 --- */}
                    <div className="input-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Author</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} required />
                    </div>

                    {/* --- Row 4 --- */}
                    <div className="input-group">
                        <label>ISBN</label>
                        <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Total Quantity (Stock)</label>
                        <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} required />
                    </div>

                    {/* --- Row 5 (Full Width) --- */}
                    <div className="input-group" style={{gridColumn: 'span 2'}}>
                        <label>Book Cover Photo {isUpdateMode && "(Required to update)"}</label>
                        <input 
                            type="file" 
                            id="file-input"
                            onChange={handleFileChange} 
                            required 
                            accept="image/png, image/jpeg"
                        />
                    </div>
                    
                    {/* --- Row 6 (Full Width) --- */}
                    <div className="input-group" style={{gridColumn: 'span 2'}}>
                        <label>Description</label>
                        <textarea 
                            rows="4" 
                            name="description"
                            value={formData.description} 
                            onChange={handleChange} 
                            placeholder="Enter a brief summary of the book..."
                        ></textarea>
                    </div>

                    {/* --- Row 7 (Full Width) --- */}
                    <div className="form-button-area">
                        <button type="submit" className="btn-primary">
                            {isUpdateMode ? 'Save Changes' : 'Add New Book'}
                        </button>
                        {isUpdateMode && (
                            <button type="button" className="btn-secondary" onClick={clearForm}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ManageBooks;