import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import HomeApp from './components/Home/HomeApp';  // (If you still want a public “landing” page)
import MainPage from './components/MainPage/MainPage'; // NEW
import SettingsPage from './components/Settings/SettingsPage'; // NEW
import FormPage from './components/Form/FormPage'; // NEW

import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import PrivateRoute from './components/Auth/PrivateRoute';

// Dark mode or global styling
import './styles/Home/global.css';
import './styles/darkmode.css'; // (NEW) – you can define your dark theme

axios.defaults.withCredentials = true;
// Change baseURL if your backend URL is different in production
axios.defaults.baseURL = 'https://realtoriqbackend.onrender.com';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  const fetchUser = async () => {
    try {
      const res = await axios.get('/auth/user');
      if (res.data && res.data.user) {
        setUser({
          id: res.data.user.id,
          email: res.data.user.email,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          displayName: res.data.user.displayName,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
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
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* If you want a landing page: */}
        <Route path="/" element={<HomeApp user={user} onLogout={handleLogout} />} />

        {/* Sign In / Sign Up */}
        <Route
          path="/signin"
          element={user ? <Navigate to="/main" /> : <SignIn onLogin={handleLogin} setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/main" /> : <SignUp setUser={setUser} />}
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

        {/* Default catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
