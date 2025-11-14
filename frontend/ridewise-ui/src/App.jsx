import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SimpleSignup from './SimpleSignup';
import SimpleLogin from './SimpleLogin';
import EnhancedDashboard from './EnhancedDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SimpleSignup />} />
        <Route path="/login" element={<SimpleLogin />} />
        <Route path="/dashboard" element={<EnhancedDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
