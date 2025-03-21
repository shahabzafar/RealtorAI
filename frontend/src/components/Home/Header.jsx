import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home/Header.css';
import { FaHome, FaUser, FaSearch, FaBell, FaRegHeart } from 'react-icons/fa';

const Header = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    console.log('Header received user:', user);
    console.log('User display name:', user?.displayName);
    console.log('User name:', user?.name);
  }, [user]);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">AI<span className="logo-highlight">Realtor</span></span>
          </Link>
        </div>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </button>

        <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className="nav-link active">
                <FaHome className="nav-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/buy" className="nav-link">
                <FaSearch className="nav-icon" />
                <span>Buy</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/rent" className="nav-link">
                <span>Rent</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sell" className="nav-link">
                <span>Sell</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/agent-finder" className="nav-link">
                <span>Find an Agent</span>
              </Link>
            </li>
          </ul>
          
          <ul className="nav-actions">
            <li className="action-item">
              <Link to="/saved" className="action-link">
                <FaRegHeart className="action-icon" />
                <span className="action-label">Saved</span>
              </Link>
            </li>
            {user ? (
              <li className="user-menu" ref={dropdownRef}>
                <button
                  className="user-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="user-avatar">
                    {user.firstName ? user.firstName.charAt(0) : "U"}
                  </div>
                  <span className="user-name">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.displayName || 'Account'} 
                  </span>
                  <span className="dropdown-arrow"></span>
                </button>
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/profile" className="dropdown-item">
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/settings" className="dropdown-item">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link to="/saved-searches" className="dropdown-item">
                          Saved Searches
                        </Link>
                      </li>
                      <li className="divider"></li>
                      <li>
                        <button 
                          onClick={() => {
                            onLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="dropdown-item logout-button"
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <li className="auth-buttons">
                <Link to="/signin" className="btn-sign-in">Sign In</Link>
                <Link to="/signup" className="btn-sign-up">Sign Up</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
