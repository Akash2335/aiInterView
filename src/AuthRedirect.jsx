import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./utils/AuthProvider";

// 🔒 Prevent logged-in users from visiting login/register pages
const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

export default AuthRedirect;
