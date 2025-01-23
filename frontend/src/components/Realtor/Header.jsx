import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home/Header.css';

const Header = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="containerHeader">
      <h1>AI Realtor</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/buy">Buy</Link>
          </li>
          <li>
            <Link to="/realtor">Realtor</Link>
          </li>
          {user ? (
            // If user is logged in
            <>
              <li className="user-menu" ref={dropdownRef}>
                <button
                  className="user-menu-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.displayName || 'Welcome User'}{' '}
                  ▼
                </button>
                {isDropdownOpen && (
                  <div className="user-dropdown">
                    <button
                      onClick={() => {
                        onLogout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            // If user is not logged in
            <>
              <li>
                <Link to="/signin" className="sign-in-link">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="sign-up-link">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
