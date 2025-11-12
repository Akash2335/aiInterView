import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const DEFAULT_LOGOUT_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_WARNING_TIME = 60 * 1000; // 1 minute

const AutoLogout = ({
  children,
  logoutTime = DEFAULT_LOGOUT_TIME,
  warningTime = DEFAULT_WARNING_TIME,
  onLogout,
  onWarning
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const logoutTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Validate props
  if (warningTime >= logoutTime) {
    console.warn('Warning time should be less than logout time');
    warningTime = logoutTime - 5000; // Default to 5 seconds before logout
  }

  // Clear all timers safely
  const clearAllTimers = useCallback(() => {
    const timers = [logoutTimerRef, warningTimerRef, countdownIntervalRef];
    
    timers.forEach(timerRef => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });
  }, []);

  // Perform logout safely
  const performLogout = useCallback(() => {
    try {
      console.log('Auto-logout due to inactivity');
      
      // Clear all data systematically
      const storageKeys = [
        'authToken',
        'refreshToken',
        'userSession',
        'userData',
        'tempSession'
      ];

      storageKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      // Clear cookies
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // Call custom logout handler if provided
      if (onLogout) {
        onLogout();
      } else {
        // Default logout behavior
        window.location.href = '/login?reason=timeout';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect to login anyway
      window.location.href = '/login';
    }
  }, [onLogout]);

  // Start countdown for warning
  const startCountdown = useCallback(() => {
    const initialTimeLeft = Math.ceil(warningTime / 1000);
    setTimeLeft(initialTimeLeft);

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          clearAllTimers();
          performLogout();
          return 0;
        }

        // Notify parent component about warning
        if (onWarning) {
          onWarning(newTime);
        }

        return newTime;
      });
    }, 1000);
  }, [warningTime, performLogout, clearAllTimers, onWarning]);

  // Reset timers on user activity
  const resetTimers = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    clearAllTimers();

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, logoutTime - warningTime);

    // Set logout timer
    logoutTimerRef.current = setTimeout(() => {
      performLogout();
    }, logoutTime);
  }, [logoutTime, warningTime, performLogout, clearAllTimers, startCountdown]);

  // Throttled activity handler
  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Throttle: only reset if at least 1 second passed since last activity
    if (timeSinceLastActivity > 1000) {
      resetTimers();
    }
  }, [resetTimers]);

  // Set up optimized event listeners
  useEffect(() => {
    const events = [
      'mousedown',
      'keydown',
      'touchstart',
      'scroll'
    ];

    // Throttled event handler
    const throttledHandlers = events.map(event => {
      let timeoutId = null;
      
      return () => {
        if (!timeoutId) {
          timeoutId = setTimeout(() => {
            handleActivity();
            timeoutId = null;
          }, 1000); // Throttle to 1 second
        }
      };
    });

    // Add event listeners
    events.forEach((event, index) => {
      document.addEventListener(event, throttledHandlers[index]);
    });

    // Initialize timers
    resetTimers();

    // Cleanup function
    return () => {
      events.forEach((event, index) => {
        document.removeEventListener(event, throttledHandlers[index]);
      });
      clearAllTimers();
    };
  }, [handleActivity, resetTimers, clearAllTimers]);

  // Modal component with better accessibility
  const WarningModal = useMemo(() => {
    if (!showWarning) return null;

    return (
      <div 
        role="dialog"
        aria-labelledby="timeout-warning-title"
        aria-describedby="timeout-warning-description"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(2px)'
        }}
      >
        <div 
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            border: '2px solid #e74c3c'
          }}
        >
          <h3 
            id="timeout-warning-title"
            style={{ 
              color: '#e74c3c', 
              marginBottom: '16px',
              fontSize: '1.25rem'
            }}
          >
            ⚠️ Session Timeout Warning
          </h3>
          
          <p 
            id="timeout-warning-description"
            style={{ 
              marginBottom: '20px',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}
          >
            You will be automatically logged out in <strong>{timeLeft} seconds</strong> due to inactivity.
          </p>
          
          <div style={{ marginTop: '24px' }}>
            <button 
              onClick={resetTimers}
              style={{
                padding: '12px 24px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2ecc71'}
              autoFocus
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    );
  }, [showWarning, timeLeft, resetTimers]);

  return (
    <>
      {children}
      {WarningModal}
    </>
  );
};

// Custom hook for manual control
export const useAutoLogout = (logoutTime) => {
  const [isActive, setIsActive] = useState(true);

  const resetActivity = useCallback(() => {
    setIsActive(true);
  }, []);

  return {
    isActive,
    resetActivity
  };
};

export default AutoLogout;