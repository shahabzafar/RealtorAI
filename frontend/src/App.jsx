import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import HomeApp from './components/Home/HomeApp';
import RealtorApp from './components/Realtor/RealtorApp';
import MainPage from './components/MainPage/MainPage';
import SettingsPage from './components/Settings/SettingsPage';
import FormPage from './components/Form/FormPage';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import PrivateRoute from './components/Auth/PrivateRoute';
import './styles/Navbar.css';
import './styles/Realtor/global.css';
import './styles/darkmode.css';



axios.defaults.withCredentials = true;
// Change baseURL based on environment
axios.defaults.baseURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000'
  : 'https://realtoriq.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/status', { withCredentials: true });
        console.log('Auth status response:', response.data);
        if (response.data.authenticated) {
          console.log('User data:', response.data.user);
          setUser(response.data.user);
          if (window.location.pathname === '/main') {
            window.location.replace('/realtor');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    // For local login, we do it inside SignIn
    // For Google login:
    window.location.href = 'https://realtoriqbackend.onrender.com/auth/google';
  };

  const handleLogout = async () => {
    try {
      await axios.get('/auth/logout');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeApp user={user} onLogout={handleLogout} />} />
        <Route 
          path="/main" 
          element={user ? <Navigate to="/realtor" /> : <Navigate to="/signin" />} 
        />
        <Route
          path="/realtor"
          element={
            <PrivateRoute user={user}>
              <RealtorApp user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route 
          path="/signin" 
          element={user ? <Navigate to="/realtor" /> : <SignIn setUser={setUser} />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/realtor" /> : <SignUp setUser={setUser} />} 
        />

        {/* Main dashboard after login */}
        <Route
          path="/main"
          element={
            <PrivateRoute user={user}>
              <MainPage user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Settings page */}
        <Route
          path="/settings"
          element={
            <PrivateRoute user={user}>
              <SettingsPage user={user} setUser={setUser} />
            </PrivateRoute>
          }
        />

        {/* Public form page for each realtor */}
        <Route path="/form/:realtorId" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
