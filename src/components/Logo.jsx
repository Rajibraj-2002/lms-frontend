// // src/components/Logo.jsx
// import React from 'react';
// // FIX: Switched to a valid icon 'RiInfinityLine'
// import { RiInfinityLine } from 'react-icons/ri'; 
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Logo = () => {
//     const navigate = useNavigate();
//     const { role } = useAuth();

//     const handleLogoClick = () => {
//         // Redirect based on role
//         if (role === 'LIBRARIAN') navigate('/admin/dashboard');
//         else navigate('/dashboard');
//     };

//     return (
//         <div className="logo-area" onClick={handleLogoClick}>
//             {/* Added rotation animation for interactivity */}
//             <div className="logo-icon" style={{ animation: 'spin 10s linear infinite' }}>
//                 <RiInfinityLine />
//             </div>
//             <div className="logo-text">LMS Prime</div>
//             <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
//         </div>
//     );
// };

// export default Logo;