// src/pages/ContactPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiMail, FiUser, FiPhone } from 'react-icons/fi'; // Import FiPhone
import { Helmet } from 'react-helmet-async';

const ContactPage = () => {
    const [contact, setContact] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContact = async () => {
            try {
                // 1. Fetch from the public endpoint
                const res = await axios.get('http://localhost:8080/api/public/librarian-contact');
                setContact(res.data);
            } catch (err) {
                console.error(err);
                setError("Could not load contact information. Ensure a Librarian is registered.");
            }
            setIsLoading(false);
        };
        fetchContact();
    }, []);

    return (
        <div>
            <Helmet>
                <title>Contact Us - LMS Prime</title>
            </Helmet>
            <header className="main-header">
                <h1>Contact Us</h1>
                <p style={{color: 'var(--text-muted)'}}>Have questions? Contact the librarian directly.</p>
            </header>

            <div className="glass-card panel">
                {isLoading ? (
                    <p>Loading contact information...</p>
                ) : error ? (
                    <p style={{color: 'var(--danger-color)'}}>{error}</p>
                ) : contact ? (
                    <div className="contact-info">
                        {/* Name */}
                        <div className="contact-item">
                            <FiUser />
                            <div>
                                <strong>Librarian Name</strong>
                                <p>{contact.name}</p>
                            </div>
                        </div>
                        
                        {/* Email */}
                        <div className="contact-item">
                            <FiMail />
                            <div>
                                <strong>Email Address</strong>
                                <p>{contact.email}</p>
                            </div>
                        </div>

                        {/* Mobile Number - NEW */}
                        <div className="contact-item">
                            <FiPhone />
                            <div>
                                <strong>Phone Number</strong>
                                <p>{contact.mobileNumber || "Not Available"}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No librarian found.</p>
                )}
            </div>
        </div>
    );
};

// Style injection
const styles = `
.contact-info { display: flex; flex-direction: column; gap: 1.5rem; }
.contact-item { display: flex; align-items: center; gap: 1rem; background: rgba(0,0,0,0.05); padding: 1rem; border-radius: 8px; }
body.dark-mode .contact-item { background: rgba(255,255,255,0.05); }
.contact-item svg { font-size: 1.5rem; color: var(--primary); }
.contact-item strong { color: var(--text-main); display: block; margin-bottom: 0.2rem; }
.contact-item p { color: var(--text-muted); margin: 0; }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ContactPage;