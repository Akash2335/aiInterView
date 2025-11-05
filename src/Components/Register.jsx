import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DarkModeContext } from '../App'; // Adjust import path as needed

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('⚠️ Please fill all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      setMessage('⚠️ Username already exists.');
      return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));

    setMessage('✅ Registered successfully! Redirecting to login...');
    setUsername('');
    setPassword('');

    setTimeout(() => navigate('/login'), 1500);
  };

  // Dark mode styles
  const darkModeStyles = {
    background: darkMode 
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      : "bg-gradient-to-br from-green-50 to-green-100",
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
      ? "focus:ring-green-500 focus:border-green-500" 
      : "focus:ring-green-400 focus:border-green-400",
    buttonBackground: darkMode 
      ? "bg-green-600 hover:bg-green-700" 
      : "bg-green-600 hover:bg-green-700",
    successMessage: darkMode 
      ? "text-green-400" 
      : "text-green-600",
    errorMessage: "text-red-500",
    divider: darkMode ? "border-gray-600" : "border-gray-300",
    loginCard: darkMode 
      ? "bg-gray-700 border-gray-600" 
      : "bg-green-50 border-green-200",
    loginText: darkMode ? "text-gray-300" : "text-gray-700",
    linkColor: darkMode 
      ? "text-green-400 hover:text-green-300" 
      : "text-green-600 hover:text-green-800"
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
          Create Account 🌱
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-5">
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
            Register
          </motion.button>
        </form>

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-center font-medium transition-colors duration-300 ${
              message.includes('✅') ? darkModeStyles.successMessage : darkModeStyles.errorMessage
            }`}
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

        {/* Login Redirect Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className={`text-center rounded-lg p-4 border transition-all duration-300 ${darkModeStyles.loginCard}`}
        >
          <p className={`transition-colors duration-300 ${darkModeStyles.loginText}`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-semibold hover:underline transition-colors duration-300 ${darkModeStyles.linkColor}`}
            >
              Login here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Register;