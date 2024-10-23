import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../../styles/Home/Header.css';

const Header = () => {
  return (
    <header>
      <div className="containerHeader">
        <h1>AI Realtor</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/buy">Buy</Link></li>
            <li><Link to="/sell">Sell</Link></li>
            <li><Link to="/signin">Sign In</Link></li> {/* Add a route for Sign In if needed */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
