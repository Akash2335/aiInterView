import React, { createContext, useState, useEffect, useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './utils/AuthProvider';
import Header from './Pages/Header';
import TabColorManager from "./Components/TabColorManager";
import ProtectedRoute from "./ProtectedRoute";
import InterviewAssistantFooter from './Pages/Footer';
import Arrow from './Pages/Arrow';
import AuthRedirect from './AuthRedirect';
import { populateInterviewHistory } from './simulateInterview';
import AutoLogout from './AutoLogout';

// Lazy-loaded components with preloading for better performance
const Login = lazy(() => import('./Components/Login'));
const Register = lazy(() => import('./Components/Register'));
const LanguageSelection = lazy(() => import('./Components/LanguageSelection'));
const UltimateJsonViewer = lazy(() => import('./Components/UltimateJsonViewer'));
const InterviewInterface = lazy(() => import('./InterviewInterface'));

// Preload critical components for better UX
const preloadLanguageSelection = () => import('./Components/LanguageSelection');
const preloadInterviewInterface = () => import('./InterviewInterface');

// ✅ Create context with capitalized name
export const DarkModeContext = createContext();

// Enhanced Loading Component for Language Selection
const LanguageSelectionLoader = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    } relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${
            darkMode
              ? "bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20"
              : "bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-rose-400/30"
          } rounded-full blur-3xl`}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-3/4 right-1/4 w-80 h-80 ${
            darkMode
              ? "bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-indigo-600/20"
              : "bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-indigo-400/30"
          } rounded-full blur-3xl`}
        />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Animated Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
              darkMode
                ? "bg-gradient-to-r from-cyan-500 to-purple-500"
                : "bg-gradient-to-r from-blue-500 to-purple-500"
            } shadow-2xl`}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white text-3xl font-bold"
            >
              AI
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r ${
            darkMode
              ? "from-white via-cyan-300 to-purple-300"
              : "from-gray-900 via-blue-700 to-purple-700"
          } bg-clip-text text-transparent`}
        >
          Loading Interview Master
        </motion.h1>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex justify-center items-center gap-2 mb-6"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className={`w-3 h-3 rounded-full ${
                darkMode ? "bg-cyan-400" : "bg-blue-500"
              }`}
            />
          ))}
        </motion.div>

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className={`text-lg ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Preparing your AI-powered interview experience...
        </motion.p>
      </div>
    </div>
  );
};

// Create a wrapper component for the redirect logic
const AppContent = () => {
  const { darkMode, setDarkMode, cameraStopTree, setCameraStopTree } = useContext(DarkModeContext);
  
  useEffect(() => {
    // Change icon and title of the browser tab
    document.title = "AI-powered interview";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = 'https://img.freepik.com/premium-psd/ai-chip-3d-illustration_1147299-2251.jpg?semt=ais_hybrid&w=740&q=80';
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = "/new-icon.ico";
      document.head.appendChild(newLink);
    }
  }, []);

  // Preload on app initialization for instant loading
  useEffect(() => {
    preloadLanguageSelection();
    preloadInterviewInterface();
  }, []);

  return (
    <>
      <TabColorManager />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Toaster position="top-right" />

      <Suspense fallback={<LanguageSelectionLoader />}>
        <Routes>
          {/* Redirect root to language selection */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Home/Language selection page */}
          <Route path="/home" element={<LanguageSelection />} />

          {/* Authentication routes */}
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />

          {/* Interview routes */}
          <Route path='/inter/:language/:mode' element={
            <ProtectedRoute>
              <InterviewInterface />
            </ProtectedRoute>
          } />

          {/* Ultimate JSON Viewer route */}
          <Route path="/questions/:language" element={
            <ProtectedRoute>
              <UltimateJsonViewer />
            </ProtectedRoute>
          } />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
      <Arrow />
      <InterviewAssistantFooter/>
    </>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [cameraStopTree, setCameraStopTree] = useState(false);
  const [scrolle, setScrolle] = useState(false);

  // Populate sample interview history on app start
  useEffect(() => {
    populateInterviewHistory(true); // Force populate to ensure data is always there
  }, []);

  return (
    <AutoLogout logoutTime={15 * 60 * 1000} warningTime={60 * 1000}>
      <AuthProvider>
        <DarkModeContext.Provider value={{ 
          darkMode, 
          setDarkMode, 
          cameraStopTree, 
          setCameraStopTree, 
          scrolle, 
          setScrolle 
        }}>
          <Router>
            <AppContent />
          </Router>
        </DarkModeContext.Provider>
      </AuthProvider>
    </AutoLogout>
  );
}

export default App;