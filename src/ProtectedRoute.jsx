
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './utils/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
