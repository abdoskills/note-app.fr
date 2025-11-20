import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Login from './pages/Login';
import Register from './pages/Register';
import { isAuthenticated } from './utils/api';
import './App.css';


function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated() && (showLogin || showRegister)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {showLogin && <Login onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />}
        {showRegister && <Register onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />}
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to NoteFlow</h1>
          <p className="text-gray-600 mb-8">Please log in to access your notes</p>
          <div className="space-x-4">
            <button 
              onClick={() => setShowLogin(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => setShowRegister(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main app for authenticated users
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;