import React, { createContext, useState, useEffect, useContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// In your main App.js
// import MouseFollower from './hooks/MouseFollower';
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './utils/AuthProvider';
import Header from './Pages/Header';
import TabColorManager from "./Components/TabColorManager";
import ProtectedRoute from "./ProtectedRoute";
import InterviewAssistantFooter from './Pages/Footer';
import Arrow from './Pages/Arrow';
import AuthRedirect from './AuthRedirect';
import { populateInterviewHistory } from './simulateInterview';

// Lazy-loaded components
const Login = lazy(() => import('./Components/Login'));
const Register = lazy(() => import('./Components/Register'));
const LanguageSelection = lazy(() => import('./Components/LanguageSelection'));
const UltimateJsonViewer = lazy(() => import('./Components/UltimateJsonViewer'));
const InterviewInterface = lazy(() => import('./InterviewInterface'));


// ✅ Create context with capitalized name
export const DarkModeContext = createContext();

// Create a wrapper component for the redirect logic
const AppContent = () => {
  // const [language, setLanguage] = useState(null);
  const { darkMode, setDarkMode,cameraStopTree,setcameraStopTree } = useContext(DarkModeContext);
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

  return (
    <>
      <TabColorManager />
       {/* <MouseFollower /> //This will handle tab color dynamically */}
      <Header darkMode={ darkMode} setDarkMode={setDarkMode}  />  {/* Remove props since we're using context */}
      <Toaster position="top-right" />

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Redirect root to language selection */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Home/Language selection page */}
          <Route path="/home" element={<LanguageSelection />} />
          {/* // Authentication routes
          // user should not access login/register if already authenticated
          <AuthRedirect>
           </AuthRedirect>
           */}
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />

          {/* Interview routes */}
          {/* <ProtectedRoute>
          <InterviewInterface />
          </ProtectedRoute>
          //use params to get language and mode
          // e.g., /inter/javascript/mock
          // then use useParams in InterviewInterface to extract them
          // This way, we avoid prop drilling
          */}
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
  const[cameraStopTree,setcameraStopTree]=useState(false);

  // Populate sample interview history on app start
  useEffect(() => {
    populateInterviewHistory(true); // Force populate to ensure data is always there
  }, []);

  return (
    <AuthProvider>
      {/* ✅ Provide dark mode context to the whole app */}
      <DarkModeContext.Provider value={{ darkMode, setDarkMode,cameraStopTree,setcameraStopTree}}>
        <Router>
          <AppContent />
        </Router>
      </DarkModeContext.Provider>
    </AuthProvider>
  );
}

export default App;