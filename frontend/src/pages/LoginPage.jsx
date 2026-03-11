import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import './AuthPages.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login
        console.log('Logging in', email);

        const from = location.state?.from?.pathname || "/";
        navigate(from);
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card">

                {/* Left Side - Brand/Decor */}
                <div className="auth-visual left-side">
                    {/* Decorative Blurs */}
                    <div className="auth-visual-decor-1"></div>
                    <div className="auth-visual-decor-2"></div>

                    <div className="relative z-10 text-center">
                        <Link to="/" className="auth-logo-link">
                            <img src="/logo-removebg-preview.png" alt="UZquettaStore Logo" className="auth-logo" />
                        </Link>
                        <h2 className="auth-heading-visual">Discover Your Premium Style.</h2>
                        <p className="auth-text-visual">Sign in to access exclusive collections, track your orders, and experience fast nationwide delivery.</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-container">
                    <div className="auth-form-header mb-8">
                        <h1 className="auth-heading-form">Welcome Back</h1>
                        <p className="auth-text-form">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="auth-form-group">
                            <label className="auth-label">Email Address</label>
                            <div className="auth-input-wrapper">
                                <div className="auth-input-icon"><Mail size={18} /></div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="auth-input"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="auth-form-group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                                <a href="#" className="text-xs text-primary hover:text-primary-hover transition-colors">Forgot password?</a>
                            </div>
                            <div className="auth-input-wrapper">
                                <div className="auth-input-icon"><Lock size={18} /></div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="auth-input"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary auth-btn">
                            Sign In
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Sign up now</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
