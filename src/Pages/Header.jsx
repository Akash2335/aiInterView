import React, { useCallback, useMemo ,useState} from 'react';
import { Sparkles, Moon, Sun, LogOut, Menu, X, Search } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthProvider';

const Header = ({ setDarkMode, darkMode }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Memoized navigation handler
  const handleNavigation = useCallback((e, to) => {
    if (window.location.pathname === to) {
      e.preventDefault();
    }
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  }, []);

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  }, [logout, navigate]);

  // Memoized theme toggle handler
  const handleThemeToggle = useCallback(() => {
    setDarkMode(prev => !prev);
  }, [setDarkMode]);

  // Memoized mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Memoized search toggle
  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
    if (!isSearchOpen) {
      setSearchQuery('');
    }
  }, [isSearchOpen]);

  // Memoized search handler
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      navigate(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  // Memoized nav link styles
  const navLinkStyle = useCallback(({ isActive }) => {
    const baseClasses = 'px-4 py-3 md:py-2 rounded-lg font-medium transition-all duration-200 text-center md:text-left';
    
    if (isActive) {
      return `${baseClasses} ${darkMode 
        ? 'bg-indigo-500 text-white shadow-md scale-105' 
        : 'bg-indigo-600 text-white shadow-md scale-105'
      }`;
    }
    
    return `${baseClasses} ${darkMode 
      ? 'text-gray-300 hover:text-white hover:bg-gray-800/70 hover:scale-105' 
      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100 hover:scale-105'
    }`;
  }, [darkMode]);

  // Memoized header background classes
  const headerClasses = useMemo(() => 
    `flex flex-col md:flex-row justify-between items-start md:items-center p-4 sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'
        : 'bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50'
    } shadow-lg`,
    [darkMode]
  );

  // Memoized theme button classes
  const themeButtonClasses = useMemo(() =>
    `p-3 rounded-2xl backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-110 group ${
      darkMode
        ? 'bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700'
        : 'bg-white/80 hover:bg-gray-50 border border-gray-200'
    }`,
    [darkMode]
  );

  // Memoized mobile menu classes
  const mobileMenuClasses = useMemo(() =>
    `absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-300 transform ${
      isMobileMenuOpen 
        ? 'opacity-100 scale-100 translate-y-0' 
        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
    } ${
      darkMode
        ? 'bg-gray-800/95 border border-gray-700'
        : 'bg-white/95 border border-gray-200'
    }`,
    [darkMode, isMobileMenuOpen]
  );

  // Memoized navigation links
  const navigationLinks = useMemo(() => {
    const links = [
      <NavLink 
        key="home"
        to="/home" 
        className={navLinkStyle}
        onClick={(e) => handleNavigation(e, '/home')}
      >
        Home
      </NavLink>
    ];

    if (!isAuthenticated) {
      links.push(
        <NavLink 
          key="login"
          to="/login" 
          className={navLinkStyle}
          onClick={(e) => handleNavigation(e, '/login')}
        >
          Login
        </NavLink>,
        <NavLink 
          key="register"
          to="/register" 
          className={navLinkStyle}
          onClick={(e) => handleNavigation(e, '/register')}
        >
          Register
        </NavLink>
      );
    } else {
      links.push(
        <NavLink 
          key="interview"
          to="/interview" 
          className={navLinkStyle}
          onClick={(e) => handleNavigation(e, '/interview')}
        >
          Interview
        </NavLink>,
        <NavLink 
          key="profile"
          to="/profile" 
          className={navLinkStyle}
          onClick={(e) => handleNavigation(e, '/profile')}
        >
          Profile
        </NavLink>
      );
    }

    return links;
  }, [isAuthenticated, navLinkStyle, handleNavigation]);

  return (
    <header className={headerClasses}>
      {/* Top Bar - Logo + Mobile Menu Button */}
      <div className="flex justify-between items-center w-full md:w-auto">
        {/* Left Section — Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
            <NavLink 
              to="/" 
              onClick={(e) => handleNavigation(e, '/')}
            >
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </NavLink>
          </div>
          <div>
            <h1 className={`text-xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Interview Assistant
            </h1>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} hidden sm:block`}>
              Voice-driven interview simulation
            </p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className={`p-3 rounded-2xl md:hidden transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white' 
              : 'bg-white/80 hover:bg-gray-50 text-gray-700'
          }`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6">
        {navigationLinks}
      </nav>

      {/* Desktop Right Section — Search + Theme Toggle + Auth */}
      <div className="hidden md:flex items-center gap-3">
        {/* Search Button */}
        <button
          onClick={toggleSearch}
          className={themeButtonClasses}
          aria-label="Toggle search"
        >
          <Search className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
        </button>

        <button
          onClick={handleThemeToggle}
          className={themeButtonClasses}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-red-500/80 hover:bg-red-600 shadow-lg text-white transition-all duration-300 hover:scale-110 flex items-center gap-2"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className={mobileMenuClasses}>
        {/* Mobile Navigation Links */}
        <nav className="flex flex-col p-4 space-y-2">
          {navigationLinks}
        </nav>

        {/* Mobile Action Buttons */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700/50">
          <button
            onClick={handleThemeToggle}
            className={themeButtonClasses}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="p-3 rounded-2xl bg-red-500/80 hover:bg-red-600 shadow-lg text-white transition-colors duration-300 flex items-center gap-2"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" /> 
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-6`}>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex items-center gap-3">
                <Search className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-indigo-600'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search interview questions..."
                  className={`flex-1 bg-transparent border-0 outline-none text-lg ${
                    darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-cyan-600 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={toggleSearch}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default React.memo(Header);