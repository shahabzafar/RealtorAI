import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeApp from './components/Home/HomeApp';
import RealtorApp from './components/Realtor/RealtorApp';
import { Navigate } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeApp />} />
        <Route path="/realtor" element={user ? <RealtorApp /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
