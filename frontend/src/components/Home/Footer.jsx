import React from 'react';
import '../../styles/Home/Footer.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-logo">
          <h2>AI Realtor</h2>
        </div>

        <div className="footer-section footer-links">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Buy</a></li>
            <li><a href="#">Sell</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h4>Contact Us</h4>
          <form className="contact-form">
            <div className="contact-left">
              <input type="email" placeholder="Email *" required />
              <input type="text" placeholder="Phone *" required />
              <button type="submit">Contact</button>
            </div>
            <div className="contact-right">
              <textarea placeholder="Type your message here" required></textarea>
            </div>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 AI Realtor. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
