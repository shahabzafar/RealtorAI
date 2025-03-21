import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Realtor/SimpleFooter.css';

const SimpleFooter = () => {
  return (
    <footer className="simple-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/benefits">Benefits For Realtors</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest updates and insights from RealtorIQ.</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter; 