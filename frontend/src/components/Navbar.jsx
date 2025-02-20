import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.displayName || user?.email || 'User';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Realtor IQ
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/realtor">Realtor</Link>
          {user ? (
            <div className="user-menu">
              <button 
                className="user-menu-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="user-name">{getUserDisplayName()}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              {isDropdownOpen && (
                <div className="user-dropdown">
                  <button onClick={onLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 