import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeApp from './components/Home/HomeApp';
import RealtorApp from './components/Realtor/RealtorApp';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeApp />} />
        <Route path="/realtor" element={<RealtorApp />} />
      </Routes>
    </Router>
  );
}

export default App;
