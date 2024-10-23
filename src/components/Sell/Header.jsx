import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sell/Header.css';

const Header = () => {
  return (
    <header>
      <div className="containerHeader">
        <div className="user-section">
          <div className="user-avatar"></div>
          <h2>Seller Dashboard</h2>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/performance">Performance</Link></li>
          </ul>
        </nav>
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search in site..."
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
