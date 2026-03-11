import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone as WhatsappIcon } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--bg-surface)', padding: '4rem 0 2rem', marginTop: 'auto', borderTop: '1px solid var(--bg-surface-light)' }}>
            <div className="container flex flex-col items-center justify-center text-center gap-6">

                <Link to="/" className="inline-block hover:scale-105 transition-transform duration-300">
                    <img src="/logo-removebg-preview.png" alt="UZquettaStore Logo" style={{ width: '400px', height: '250px', objectFit: 'cover' }} />
                </Link>

                <p className="text-muted max-w-md -mt-16">Premium Quality, Delivered Fresh to Your Doorstep. Discover your premium style with UZquettaStore.</p>

                <div className="flex gap-6 mt-2">
                    <a href="https://www.facebook.com/profile.php?id=61584876434235" target="_blank" rel="noreferrer" className="text-muted hover:text-primary transition-colors"><Facebook size={24} /></a>
                    <a href="https://www.instagram.com/uzquetta.store?igsh=MTQ3N2h6OWRrdWk3bA==" target="_blank" rel="noreferrer" className="text-muted hover:text-primary transition-colors"><Instagram size={24} /></a>
                    <a href="https://wa.me/923133844566" target="_blank" rel="noreferrer" className="text-muted hover:text-primary transition-colors"><WhatsappIcon size={24} /></a>
                    <a href="https://www.tiktok.com/@uzquetta.store?_r=1&_t=ZS-94bAuS3vKmv" target="_blank" rel="noreferrer" className="text-muted hover:text-primary transition-colors text-sm font-bold pt-1">TikTok</a>
                </div>

                <div className="w-full max-w-lg border-t border-surface-light mt-4 pt-6">
                    <p className="text-muted text-sm">&copy; {new Date().getFullYear()} UZquettaStore. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
