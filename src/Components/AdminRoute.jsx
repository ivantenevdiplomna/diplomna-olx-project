import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    // Get the user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Check if user is logged in and is an admin
    if (!user || !user.isAdmin) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

export default AdminRoute; 