import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Auth/Auth.css';

const SignIn = ({ onLogin, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://realtoriqbackend.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          ...data.user,
          displayName: `${data.user.firstName} ${data.user.lastName}`.trim()
        };
        onLogin(userData);
        navigate('/realtor');
      } else {
        const error = await response.json();
        setError(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${axios.defaults.baseURL}/auth/google`;
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="divider">or</div>

        {/* Google Login Button */}
        <button onClick={handleGoogleLogin} className="google-button">
          Login with Google
        </button>

        {/* Link to Sign Up */}
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
