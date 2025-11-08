import React, { useState, useEffect, useRef, useCallback } from 'react';

const AutoLogout = ({ children, logoutTime = 1000, warningTime =  1000 }) => {
  const [isActive, setIsActive] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const logoutTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const activityTimerRef = useRef(null);

  // Function to handle user activity
  const handleActivity = useCallback(() => {
    setIsActive(true);
    setShowWarning(false);
    
    // Clear existing timers
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    
    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(warningTime / 1000);
      
      // Start countdown for logout
      const countdownInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    }, logoutTime - warningTime);
    
    // Set logout timer
    logoutTimerRef.current = setTimeout(() => {
      performLogout();
    }, logoutTime);
    
  }, [logoutTime, warningTime]);

  // Function to perform logout
  const performLogout = () => {
    console.log('User logged out due to inactivity');
    // Add your logout logic here
    // For example: clear tokens, redirect to login, etc.
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userSession');
    window.location.href = '/login'; // Redirect to login page
  };

  // Function to reset timers (manual activity)
  const resetTimers = () => {
    handleActivity();
  };

  // Set up event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      handleActivity();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Initialize the timers
    handleActivity();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    };
  }, [handleActivity]);

  // Extended version with modal warning
  const ExtendedAutoLogout = () => (
    <div>
      {children}
      
      {showWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <h3>Session Timeout Warning</h3>
            <p>You will be logged out due to inactivity in {timeLeft} seconds.</p>
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={resetTimers}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return <ExtendedAutoLogout />;
};

// Usage example:
export default AutoLogout;