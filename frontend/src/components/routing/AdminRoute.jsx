import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    // TODO: Add actual auth check
    const isAdmin = true;
    return isAdmin ? children : <Navigate to="/login" replace />;
};
export default AdminRoute;
