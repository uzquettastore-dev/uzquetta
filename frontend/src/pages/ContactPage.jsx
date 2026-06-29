import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Phone as WhatsappIcon, Mail, MapPin, Clock, Send } from 'lucide-react';
import './ContactPage.css';

const WHATSAPP_NUMBER = '923133844566';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    // Scroll-reveal IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-title').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = `*New enquiry from UZquettaStore website*%0A%0A` +
            `*Name:* ${form.name}%0A` +
            `*Email:* ${form.email}%0A` +
            `*Subject:* ${form.subject}%0A%0A` +
            `${form.message}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    };

    return (
        <div className="contact-page reveal-scale">
            {/* Header */}
            <div className="contact-hero reveal">
                <span className="contact-eyebrow">We're here to help</span>
                <h1>Get in Touch</h1>
                <p>Have a question about an order, a product, or anything else? Our team usually replies within a few hours — reach out through any channel below.</p>
            </div>

            <div className="contact-grid">
                {/* LEFT — contact details */}
                <div className="contact-info reveal-left stagger-1">
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="contact-card contact-method">
                        <span className="contact-method-icon"><WhatsappIcon size={24} /></span>
                        <span>
                            <p className="contact-method-label">WhatsApp Support</p>
                            <p className="contact-method-value">+92 313 3844566</p>
                        </span>
                    </a>

                    <a href="mailto:uzquettastore@gmail.com" className="contact-card contact-method">
                        <span className="contact-method-icon"><Mail size={24} /></span>
                        <span>
                            <p className="contact-method-label">Email Address</p>
                            <p className="contact-method-value">uzquettastore@gmail.com</p>
                        </span>
                    </a>

                    <div className="contact-card contact-method">
                        <span className="contact-method-icon"><MapPin size={24} /></span>
                        <span>
                            <p className="contact-method-label">Store Location</p>
                            <p className="contact-method-value">Quetta, Pakistan</p>
                        </span>
                    </div>

                    {/* Business hours */}
                    <div className="contact-card contact-hours">
                        <div className="contact-hours-head">
                            <Clock size={18} /> Business Hours
                        </div>
                        <div className="contact-hours-row">
                            <span>Monday – Saturday</span>
                            <span>10:00 AM – 9:00 PM</span>
                        </div>
                        <div className="contact-hours-row">
                            <span>Sunday</span>
                            <span>2:00 PM – 8:00 PM</span>
                        </div>
                        <div className="contact-hours-row">
                            <span>Online Orders</span>
                            <span className="contact-hours-badge">24 / 7</span>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="contact-card contact-socials">
                        <a href="https://www.facebook.com/profile.php?id=61584876434235" target="_blank" rel="noreferrer" className="contact-social fb">
                            <span className="contact-social-icon"><Facebook size={20} /></span>
                            <span>Facebook</span>
                        </a>
                        <a href="https://www.instagram.com/uzquetta.store?igsh=MTQ3N2h6OWRrdWk3bA==" target="_blank" rel="noreferrer" className="contact-social ig">
                            <span className="contact-social-icon"><Instagram size={20} /></span>
                            <span>Instagram</span>
                        </a>
                        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="contact-social wa">
                            <span className="contact-social-icon"><WhatsappIcon size={20} /></span>
                            <span>WhatsApp</span>
                        </a>
                        <a href="https://www.tiktok.com/@uzquetta.store?_r=1&_t=ZS-94bAuS3vKmv" target="_blank" rel="noreferrer" className="contact-social tt">
                            <span className="contact-social-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </span>
                            <span>TikTok</span>
                        </a>
                    </div>
                </div>

                {/* RIGHT — contact form */}
                <div className="contact-card contact-form-card reveal-right stagger-2">
                    <h2>Send us a message</h2>
                    <p className="form-sub">Fill in the form and we'll continue the conversation on WhatsApp.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="contact-row">
                            <div className="contact-field">
                                <label htmlFor="name">Full Name</label>
                                <input id="name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="contact-field">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="contact-field">
                            <label htmlFor="subject">Subject</label>
                            <input id="subject" name="subject" type="text" placeholder="Order, product enquiry, etc." value={form.subject} onChange={handleChange} required />
                        </div>

                        <div className="contact-field">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" placeholder="How can we help you?" value={form.message} onChange={handleChange} required />
                        </div>

                        <button type="submit" className="btn btn-primary contact-submit">
                            <Send size={18} /> Send via WhatsApp
                        </button>
                        <p className="contact-form-note">We typically respond within a few hours during business hours.</p>
                    </form>
                </div>
            </div>

            {/* Map */}
            <div className="contact-map reveal stagger-3">
                <iframe
                    title="UZquettaStore location — Quetta, Pakistan"
                    src="https://www.google.com/maps?q=Quetta,Pakistan&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
};

export default ContactPage;
