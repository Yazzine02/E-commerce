import React from 'react';
import { FaShoppingCart, FaUserCircle, FaHeadset, FaSignInAlt } from 'react-icons/fa';  // Importing login icon
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';  // Importing the Cart context
import '../styles/Header.css';

function Header() {
  const { cartItems } = useCart();  // Accessing cart items from the context
  const cartCount = cartItems.length;  // Getting the count of items in the cart

  return (
    <header className="header">
      <div className="logo">ibrahim shop</div>
      <input className="search-bar" type="text" placeholder="Search product" />
      <nav className="nav-links">
        <Link to="/" className="nav-item">
          <FaHeadset className="icon" />
          Customer Service
        </Link>
        <Link to="/login" className="nav-item">  {/* Link to login page */}
          <FaSignInAlt className="icon" />
          Login
        </Link>
        <Link to="/" className="nav-item">
          <FaUserCircle className="icon" />
          Account & Lists
        </Link>
        <Link to="/cart" className="nav-item">
          <FaShoppingCart className="icon" />
          Cart
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>} {/* Show cart count */}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
