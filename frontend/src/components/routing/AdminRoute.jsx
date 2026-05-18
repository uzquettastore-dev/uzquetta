import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const adminInfo = localStorage.getItem('adminInfo');
    
    let isAdmin = false;
    if (adminInfo) {
        try {
            const parsed = JSON.parse(adminInfo);
            if (parsed && parsed.role === 'admin' && parsed.token) {
                isAdmin = true;
            }
        } catch (e) {
            isAdmin = false;
        }
    }
    
    return isAdmin ? children : <Navigate to="/secure-admin-login" replace />;
};

export default AdminRoute;
