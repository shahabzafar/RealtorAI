import React, { useEffect, useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import FeaturedProperties from './FeaturedProperties';
import Services from './Services';
import AiChat from './AiChat';
import RealEstateTrends from './RealEstateTrends';
import Footer from './Footer';
import '../../styles/Home/global.css';

const HomeApp = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch authenticated user info on component mount
    fetch('http://localhost:5000/auth/user', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/auth/logout', { credentials: 'include' })
      .then(() => setUser(null))
      .catch((error) => console.error("Error logging out:", error));
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        {user ? (
          <div>
            <span>Welcome, {user.displayName}</span>
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Login with Google</button>
        )}
      </div>
      <Hero />
      <FeaturedProperties />
      <Services />
      <AiChat />
      <RealEstateTrends />
      <Footer />
    </div>
  );
};

export default HomeApp;
