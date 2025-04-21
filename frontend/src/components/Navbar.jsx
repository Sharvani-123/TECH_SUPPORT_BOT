// components/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">TechEase</div>
      <div className="navbar-right">
        <span>Home</span>
        <span>Services</span>
        <span>Billing</span>
      </div>
    </nav>
  );
};

export default Navbar;