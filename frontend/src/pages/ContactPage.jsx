import React from 'react';
import { Facebook, Instagram, Phone as WhatsappIcon, Mail, MapPin } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="container py-20 flex flex-col items-center justify-center min-h-[70vh] slide-up">
            <div className="glass p-10 md:p-16 rounded-2xl w-full max-w-2xl text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 transform translate-x-10 -translate-y-10"></div>

                <h1 className="text-4xl font-extrabold mb-4 text-main">Get in Touch</h1>
                <p className="text-muted text-lg mb-10">We'd love to hear from you. Reach out to us through any of the platforms below.</p>

                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-12">
                    <a href="https://www.facebook.com/profile.php?id=61584876434235" target="_blank" rel="noreferrer" className="flex flex-col items-center group text-muted hover:text-primary transition-colors px-4 sm:px-8 py-4">
                        <Facebook size={48} className="group-hover:scale-110 transition-transform duration-300 mb-5" />
                        <span className="font-semibold text-sm uppercase tracking-widest">Facebook</span>
                    </a>
                    <a href="https://www.instagram.com/uzquetta.store?igsh=MTQ3N2h6OWRrdWk3bA==" target="_blank" rel="noreferrer" className="flex flex-col items-center group text-muted hover:text-primary transition-colors px-4 sm:px-8 py-4">
                        <Instagram size={48} className="group-hover:scale-110 transition-transform duration-300 mb-5" />
                        <span className="font-semibold text-sm uppercase tracking-widest">Instagram</span>
                    </a>
                    <a href="https://wa.me/923133844566" target="_blank" rel="noreferrer" className="flex flex-col items-center group text-muted hover:text-primary transition-colors px-4 sm:px-8 py-4">
                        <WhatsappIcon size={48} className="group-hover:scale-110 transition-transform duration-300 mb-5" />
                        <span className="font-semibold text-sm uppercase tracking-widest">WhatsApp</span>
                    </a>
                    <a href="https://www.tiktok.com/@uzquetta.store?_r=1&_t=ZS-94bAuS3vKmv" target="_blank" rel="noreferrer" className="flex flex-col items-center group text-muted hover:text-primary transition-colors px-4 sm:px-8 py-4">
                        <span className="text-4xl font-extrabold group-hover:scale-110 transition-transform duration-300 mb-5">t</span>
                        <span className="font-semibold text-sm uppercase tracking-widest">TikTok</span>
                    </a>
                </div>

                <div className="border-t border-surface-light pt-8 flex flex-col gap-4 text-left mx-auto max-w-md">
                    <div className="flex items-center gap-4 text-muted">
                        <WhatsappIcon className="text-primary" size={20} />
                        <span>+92 313 3844566</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted">
                        <Mail className="text-primary" size={20} />
                        <span>uzquettastore@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted">
                        <MapPin className="text-primary" size={20} />
                        <span>Quetta, Pakistan</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
