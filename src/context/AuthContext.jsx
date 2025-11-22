/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const AuthContext = createContext();

// 1. Helper function runs ONLY ONCE on init (Fixes initial load setState warning)
const getInitialState = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear(); 
                return { token: null, role: null, username: null };
            }
            const role = decoded.role; 
            return { token, role, username: decoded.sub };
        } catch (err) { 
            console.error("Failed to decode token on initial load:", err); 
            localStorage.clear();
            return { token: null, role: null, username: null };
        }
    }
    return { token: null, role: null, username: null };
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // 2. Initialize state synchronously
    const [isLoading, setIsLoading] = useState(false); 
    const [authState, setAuthState] = useState(getInitialState); 
    
    const [stompClient, setStompClient] = useState(null);
    const stompClientRef = useRef(null); 

    // 3. Define stable connect/disconnect functions using useCallback (Fixes dependency warnings)
    const connectClient = useCallback((token) => {
        const client = new Client({
            webSocketFactory: () => new SockJS('https://lms-backend-0jw8.onrender.com/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket Connected!');
                setStompClient(client);
                stompClientRef.current = client;
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            },
        });
        client.activate();
        return client;
    }, []);

    const disconnectClient = useCallback(() => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            setStompClient(null); 
            stompClientRef.current = null;
            console.log('WebSocket Disconnected');
        }
    }, []);


    // 4. WebSocket Connection/Disconnection Logic
    useEffect(() => {
        // Connect when token is available and no client exists
        if (authState.token && !stompClient) {
             connectClient(authState.token);
        } 
        // Disconnect when token is removed and client exists
        else if (!authState.token && stompClient) {
            disconnectClient();
        }
    }, [authState.token, stompClient, connectClient, disconnectClient]);


    // Login function
    const login = (newToken, newRole) => {
        localStorage.setItem('jwtToken', newToken);
        localStorage.setItem('userRole', newRole);
        
        const decoded = jwtDecode(newToken);
        setAuthState({ token: newToken, role: newRole, username: decoded.sub });
        
        // Disconnect any old session before navigating (good practice)
        disconnectClient(); 
        
        if (newRole === 'LIBRARIAN') navigate('/admin/dashboard');
        else navigate('/dashboard');
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        
        // Disconnect WebSocket client immediately upon logout
        disconnectClient();
        
        setAuthState({ token: null, role: null, username: null });
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ ...authState, isLoading, stompClient, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};