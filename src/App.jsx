import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeApp from './components/Home/HomeApp';
import SellApp from './components/Sell/SellApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeApp />} />
        <Route path="/sell" element={<SellApp />} />
      </Routes>
    </Router>
  );
}

export default App;
