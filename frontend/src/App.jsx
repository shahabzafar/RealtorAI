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

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/status');
        if (response.data.authenticated) {
          setUser(response.data.user);
          // If user is already authenticated and hits /main, redirect to /realtor
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
        
        {/* If user is logged in, /main -> /realtor, else /signin */}
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

        <Route
          path="/settings"
          element={
            <PrivateRoute user={user}>
              <SettingsPage user={user} setUser={setUser} />
            </PrivateRoute>
          }
        />

        {/* Public form page */}
        <Route path="/form/:realtorId" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
