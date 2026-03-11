import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import './AuthPages.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        // Simulate register
        console.log('Registering', name, email);
        navigate('/');
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">

                {/* Left Visual Side - Brand/Decor (Now order-last on desktop) */}
                <div className="auth-visual right-side auth-order-1 md:auth-order-2">
                    {/* Decorative Blurs */}
                    <div className="auth-visual-decor-1 bottom-left"></div>
                    <div className="auth-visual-decor-2 top-right"></div>

                    <div className="relative z-10 text-center">
                        <Link to="/" className="auth-logo-link">
                            <img src="/logo-removebg-preview.png" alt="UZquettaStore Logo" className="auth-logo" />
                        </Link>
                        <h2 className="auth-heading-visual">Join the Premium Standard.</h2>
                        <p className="auth-text-visual">Create an account to unlock fast checkout, order tracking, and exclusive discounts.</p>
                    </div>
                </div>

                {/* Right Visual Side - Form */}
                <div className="auth-form-container auth-order-2 md:auth-order-1">
                    <div className="auth-form-header mb-8">
                        <h1 className="auth-heading-form">Create Account</h1>
                        <p className="auth-text-form">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="auth-form-group">
                            <label className="auth-label">Full Name</label>
                            <div className="auth-input-wrapper">
                                <div className="auth-input-icon"><User size={18} /></div>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="auth-input" placeholder="John Doe" />
                            </div>
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Email Address</label>
                            <div className="auth-input-wrapper">
                                <div className="auth-input-icon"><Mail size={18} /></div>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="you@example.com" />
                            </div>
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Password</label>
                            <div className="auth-input-wrapper">
                                <div className="auth-input-icon"><Lock size={18} /></div>
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Confirm Password</label>
                            <div className="auth-input-wrapper">
                                <div className="auth-input-icon"><Lock size={18} /></div>
                                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="auth-input" placeholder="••••••••" />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary auth-btn">
                            Sign Up
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;
