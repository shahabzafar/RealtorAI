import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import App from './App';

import './styles/Home/global.css';

const isProd = (process.env.NODE_ENV === 'production');
const backendUrl = isProd
  ? process.env.REACT_APP_BACKEND_URL || 'https://realtoriqbackend.onrender.com'
  : 'http://localhost:5000';

// Set default axios configuration for the frontend
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

console.log('React Environment:', process.env.NODE_ENV);
console.log('Using Backend URL:', axios.defaults.baseURL);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
