// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  // Check for the admin token in localStorage
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin-login" />;
  }
  return children;
}

export default AdminRoute;
