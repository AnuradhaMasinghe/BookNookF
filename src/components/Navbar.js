// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaBook, FaHeart } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">The Book Nook</h2>
      <ul className="nav-links">
        <li><Link to="/Booklist"><FaBook /> Book List</Link></li>
        <li><Link to="/Cart"><FaShoppingCart /> Cart</Link></li>
        <li><Link to="/FavoritePage"><FaHeart /> Favorites</Link></li> {/* Added Favorites link */}
        <li><Link to="/ProfilePage"><FaUserCircle /> Profile</Link></li>
        <li><Link to="/"><FaSignOutAlt /> Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
