import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          URL Shortener
        </Link>
        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.name || user?.email}</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

