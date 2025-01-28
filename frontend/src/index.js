import React from 'react';
import ReactDOM from 'react-dom';
import './styles/Home/global.css';
import App from './App';
import axios from 'axios';

// Set default axios configuration
const backendUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000'
  : 'https://realtoriqbackend.onrender.com';

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

console.log('Current environment:', process.env.NODE_ENV);
console.log('Backend URL:', backendUrl);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


