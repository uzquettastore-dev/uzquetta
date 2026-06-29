import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div
            className="container"
            style={{
                minHeight: '70vh',
                marginTop: '90px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '4rem 1.5rem',
            }}
        >
            <div
                style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: 'clamp(5rem, 18vw, 9rem)',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.5rem',
                }}
            >
                404
            </div>

            <h1
                style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
                    fontWeight: 800,
                    marginBottom: '0.75rem',
                }}
            >
                Page Not Found
            </h1>

            <p
                style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.05rem',
                    maxWidth: '460px',
                    lineHeight: 1.7,
                    marginBottom: '2.5rem',
                }}
            >
                The page you're looking for doesn't exist or may have moved. Let's get you back on track.
            </p>

            <div
                style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                }}
            >
                <Link to="/" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }}>
                    <Home size={18} /> Back to Home
                </Link>
                <Link to="/products" className="btn btn-outline" style={{ padding: '0.9rem 2rem' }}>
                    <Search size={18} /> Browse Shop
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
