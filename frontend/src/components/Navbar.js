import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Upload, GitBranch, Settings, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Jade AI</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <User size={18} />
                Dashboard
              </Link>
              <Link 
                to="/resume-upload" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FileText size={18} />
                Resumes
              </Link>
              <Link 
                to="/jd-upload" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Upload size={18} />
                Job Descriptions
              </Link>
              <Link 
                to="/match-resume" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <GitBranch size={18} />
                Match
              </Link>
              <Link 
                to="/jade-converter" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Settings size={18} />
                Jade Converter
              </Link>
            </div>
          )}

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-gray-600">
                Welcome back!
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {user && (
          <div className="md:hidden border-t">
            <div className="flex flex-wrap items-center justify-center gap-4 py-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <User size={16} />
                Dashboard
              </Link>
              <Link 
                to="/resume-upload" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FileText size={16} />
                Resumes
              </Link>
              <Link 
                to="/jd-upload" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Upload size={16} />
                Job Descriptions
              </Link>
              <Link 
                to="/match-resume" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <GitBranch size={16} />
                Match
              </Link>
              <Link 
                to="/jade-converter" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Settings size={16} />
                Jade Converter
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


