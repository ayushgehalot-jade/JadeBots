import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import JDUpload from './pages/JDUpload';
import MatchResume from './pages/MatchResume';
import MatchResults from './pages/MatchResults';
import JadeConverter from './pages/JadeConverter';
import JadeTemplates from './pages/JadeTemplates';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume-upload" 
                element={
                  <ProtectedRoute>
                    <ResumeUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jd-upload" 
                element={
                  <ProtectedRoute>
                    <JDUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/match-resume" 
                element={
                  <ProtectedRoute>
                    <MatchResume />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/match-results/:matchId" 
                element={
                  <ProtectedRoute>
                    <MatchResults />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jade-converter" 
                element={
                  <ProtectedRoute>
                    <JadeConverter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jade-templates" 
                element={
                  <ProtectedRoute>
                    <JadeTemplates />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


