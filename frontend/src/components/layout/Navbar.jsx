import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartItems } = useCart();

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
            <div className="container navbar-container">

                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <img src="/logo-removebg-preview.png" alt="UZquettaStore Logo" />
                </Link>

                {/* Desktop Nav */}
                <nav className="navbar-links desktop-only">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Shop</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink>
                </nav>

                {/* Actions */}
                <div className="navbar-actions">
                    <Link to="/cart" className="icon-btn">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>
                    <Link to="/login" className="icon-btn">
                        <User size={24} />
                    </Link>

                    <button
                        className="mobile-menu-btn icon-btn mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav-links">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
