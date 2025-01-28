import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ user, children }) => {
  const isAuthenticated = !!user; // Check if user exists
  
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
