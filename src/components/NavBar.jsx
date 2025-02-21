import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext.jsx';
import "../style/navbar.css"
import logo from '../assets/tasktracker-logo.png'

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav>
        
        <Link to="/" aria-label="Go to Home"><img src={logo} style={{width:'30vw',maxWidth:'200px', height:'auto'}} alt='Task Tracker Logo'/></Link>
        <ul style={{marginRight:'2vw'}}>
        {isLoggedIn ? (
          <>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" aria-label="Go to Login page">Login</Link></li>
            <li><Link to="/signup" aria-label="Go to Signup page">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
