import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="brand">FoodApp</Link>
        </div>
        <div className="nav-right">
          <Link to="/user/register">Register (User)</Link>
          <Link to="/food-partner/register">Register (Partner)</Link>
          <Link to="/user/login">Login</Link>
          <Link to="/food-partner/login">Partner Login</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
