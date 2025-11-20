import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../utils/AuthProvider';
import { motion } from 'framer-motion';
import { DarkModeContext } from '../App'; // Adjust import path as needed

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username] === password) {
      let permissions = [];
      if (username === 'akash@2335') {
         permissions = [
          "Personal", "Testing", "Aws", "React", "SQL", "CICD", "NetCore", "EntityFramework", "LINQ",
          "AsyncAwaitQ", "AsyncAwaitBasic", "AsyncFollowUp", "AsyncPatterns", "CSharp", "cCollection",
          "cicdAction", "entityFramwork", "JavaScript", "LINQAdvanced", "LINQQueryPractice",
          "NETCaseStudies", "NETCoreAWS", "NETFollowUp", "ReactFollowUp", "ReduxStateManagement",
          "SQLCaseStudies", "SQLQueryStudies","ShapBasic","Ccoding","Api"
        ];
      } else {
        // For other users, allow all languages
        permissions = ["Aws", "React", "SQL", "CICD", "NetCore", "EntityFramework", "LINQ",
          "AsyncAwaitQ", "AsyncAwaitBasic", "AsyncFollowUp", "AsyncPatterns", "CSharp", "cCollection",
          "cicdAction", "entityFramwork", "JavaScript", "LINQAdvanced", "LINQQueryPractice",
          "NETCaseStudies", "NETCoreAWS", "NETFollowUp", "ReactFollowUp", "ReduxStateManagement",
          "SQLCaseStudies", "SQLQueryStudies","ShapBasic","Ccoding","Api"
        ];
      }
      login(username, permissions);
      navigate('/');
    } else {
      setMessage('⚠️ Invalid credentials.');
      navigate('/register');
    }
  };

  // Dark mode styles
  const darkModeStyles = {
    background: darkMode 
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      : "bg-gradient-to-br from-blue-50 to-blue-100",
    cardBackground: darkMode 
      ? "bg-gray-800 border-gray-700" 
      : "bg-white border-gray-200",
    textPrimary: darkMode ? "text-white" : "text-gray-800",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-700",
    textTertiary: darkMode ? "text-gray-400" : "text-gray-500",
    inputBackground: darkMode 
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-800 placeholder-gray-500",
    inputFocus: darkMode 
      ? "focus:ring-blue-500 focus:border-blue-500" 
      : "focus:ring-blue-400 focus:border-blue-400",
    buttonBackground: darkMode 
      ? "bg-blue-600 hover:bg-blue-700" 
      : "bg-blue-600 hover:bg-blue-700",
    divider: darkMode ? "border-gray-600" : "border-gray-300",
    registerCard: darkMode 
      ? "bg-gray-700 border-gray-600" 
      : "bg-blue-50 border-blue-200",
    registerText: darkMode ? "text-gray-300" : "text-gray-700",
    linkColor: darkMode 
      ? "text-blue-400 hover:text-blue-300" 
      : "text-blue-600 hover:text-blue-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkModeStyles.background}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full max-w-md rounded-2xl shadow-2xl p-8 border transition-colors duration-300 ${darkModeStyles.cardBackground}`}
      >
        {/* Title */}
        <h2 className={`text-3xl font-bold text-center mb-6 tracking-tight transition-colors duration-300 ${darkModeStyles.textPrimary}`}>
          Welcome Back 👋
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${darkModeStyles.inputBackground} ${darkModeStyles.inputFocus}`}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${darkModeStyles.inputBackground} ${darkModeStyles.inputFocus}`}
            required
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${darkModeStyles.buttonBackground}`}
          >
            Login
          </motion.button>
        </form>

        {/* Error Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-red-500 font-medium"
          >
            {message}
          </motion.p>
        )}

        {/* Divider */}
        <div className={`my-6 flex items-center transition-colors duration-300 ${darkModeStyles.divider}`}>
          <div className={`flex-grow border-t transition-colors duration-300 ${darkModeStyles.divider}`}></div>
          <span className={`mx-3 text-sm transition-colors duration-300 ${darkModeStyles.textTertiary}`}>OR</span>
          <div className={`flex-grow border-t transition-colors duration-300 ${darkModeStyles.divider}`}></div>
        </div>

        {/* Registration Link Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className={`text-center rounded-lg p-4 border transition-all duration-300 ${darkModeStyles.registerCard}`}
        >
          <p className={`transition-colors duration-300 ${darkModeStyles.registerText}`}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className={`font-semibold hover:underline transition-colors duration-300 ${darkModeStyles.linkColor}`}
            >
              Register here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;