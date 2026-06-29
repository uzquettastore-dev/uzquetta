import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone as WhatsappIcon, Mail, MapPin, PhoneCall } from 'lucide-react';

/* ─── style constants (referencing CSS custom‑properties where possible) ─── */
const colors = {
  bg: '#0f172a',
  bgGradient: 'linear-gradient(180deg, #0f172a 0%, #1a1f3a 50%, #0f172a 100%)',
  gold: 'var(--primary, #d4af37)',
  goldDark: 'var(--primary-dark, #aa8c2c)',
  goldLight: 'var(--primary-light, #f1df87)',
  textHeading: '#ffffff',
  textBody: '#94a3b8',
  textMuted: '#64748b',
  separator: 'linear-gradient(90deg, transparent, var(--primary, #d4af37), transparent)',
  socialBg: 'rgba(212, 175, 55, 0.08)',
  socialHoverBg: 'rgba(212, 175, 55, 0.18)',
  socialGlow: '0 0 18px rgba(212, 175, 55, 0.45)',
};

const fonts = {
  heading: "var(--font-heading, 'Outfit', sans-serif)",
  body: "var(--font-body, 'Inter', sans-serif)",
};

/* ─── TikTok SVG Icon ─── */
const TikTokIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

/* ─── data ─── */
const socialLinks = [
  { href: 'https://www.facebook.com/profile.php?id=61584876434235', icon: Facebook, label: 'Facebook' },
  { href: 'https://www.instagram.com/uzquetta.store?igsh=MTQ3N2h6OWRrdWk3bA==', icon: Instagram, label: 'Instagram' },
  { href: 'https://wa.me/923133844566', icon: WhatsappIcon, label: 'WhatsApp' },
  { href: 'https://www.tiktok.com/@uzquetta.store?_r=1&_t=ZS-94bAuS3vKmv', icon: TikTokIcon, label: 'TikTok' },
];

const quickLinks = [
  { to: '/', text: 'Home' },
  { to: '/products', text: 'Shop' },
  { to: '/contact', text: 'Contact' },
  { to: '/login', text: 'Login' },
];

const customerService = [
  { href: 'https://wa.me/923133844566', text: 'Track Order' },
  { to: '/contact', text: 'Return Policy' },
  { to: '/contact', text: 'FAQs' },
];

const contactInfo = [
  { icon: PhoneCall, text: '+92 313 3844566' },
  { icon: Mail, text: 'uzquettastore@gmail.com' },
  { icon: MapPin, text: 'Pakistan' },
];

/* ─── SocialIcon with hover glow ─── */
const SocialIcon = ({ href, Icon, label }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: hovered ? colors.socialHoverBg : colors.socialBg,
        border: `1px solid ${hovered ? colors.gold : 'rgba(148, 163, 184, 0.15)'}`,
        color: hovered ? colors.gold : colors.textBody,
        boxShadow: hovered ? colors.socialGlow : 'none',
        transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <Icon size={20} />
    </a>
  );
};

/* ─── Column heading with gold underline ─── */
const ColumnHeading = ({ children }) => (
  <h4
    style={{
      fontFamily: fonts.heading,
      fontSize: '0.8rem',
      fontWeight: 700,
      color: colors.textHeading,
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      marginBottom: 24,
      paddingBottom: 12,
      position: 'relative',
      lineHeight: 1.4,
    }}
  >
    {children}
    <span
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 36,
        height: 2,
        background: colors.gold,
        borderRadius: 2,
      }}
    />
  </h4>
);

/* ─── Footer link with gold hover (internal Link or external href) ─── */
const FooterLink = ({ to, href, children }) => {
  const [hovered, setHovered] = useState(false);

  const style = {
    fontFamily: fonts.body,
    fontSize: '0.9rem',
    color: hovered ? colors.gold : colors.textBody,
    textDecoration: 'none',
    transition: 'color 0.3s ease, padding-left 0.3s ease',
    display: 'block',
    paddingLeft: hovered ? 6 : 0,
    lineHeight: 1.6,
    marginBottom: 10,
  };

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" style={style} {...handlers}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} style={style} {...handlers}>
      {children}
    </Link>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FOOTER ━━━━━ */
const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) {
      footerRef.current.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-title').forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        background: colors.bgGradient,
        color: colors.textBody,
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle decorative top edge */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: colors.separator,
        }}
      />

      {/* ─── Main grid ─── */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '80px 24px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 48,
        }}
        className="footer-grid"
      >
        {/* Column 1 — Brand */}
        <div className="reveal stagger-1" style={{ gridColumn: 'auto' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: 20 }}>
            <img
              src="/logo-removebg-preview.png"
              alt="UZquettaStore Logo"
              style={{
                width: 200,
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(1.15)',
              }}
            />
          </Link>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: '0.9rem',
              lineHeight: 1.75,
              color: colors.textBody,
              marginBottom: 24,
              maxWidth: 280,
            }}
          >
            Premium Quality, Delivered Fresh to Your Doorstep. Discover your premium style with UZquettaStore.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <SocialIcon key={label} href={href} Icon={Icon} label={label} />
            ))}
          </div>
        </div>

        {/* Column 2 — Quick Links */}
        <div className="reveal stagger-2">
          <ColumnHeading>Quick Links</ColumnHeading>
          {quickLinks.map(({ to, text }) => (
            <FooterLink key={to} to={to}>
              {text}
            </FooterLink>
          ))}
        </div>

        {/* Column 3 — Customer Service */}
        <div className="reveal stagger-3">
          <ColumnHeading>Customer Service</ColumnHeading>
          {customerService.map(({ to, href, text }) => (
            <FooterLink key={text} to={to} href={href}>
              {text}
            </FooterLink>
          ))}
        </div>

        {/* Column 4 — Contact */}
        <div className="reveal stagger-4">
          <ColumnHeading>Contact Us</ColumnHeading>
          {contactInfo.map(({ icon: Icon, text }, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
                fontFamily: fonts.body,
                fontSize: '0.9rem',
                color: colors.textBody,
                lineHeight: 1.6,
              }}
            >
              <Icon size={18} style={{ color: colors.gold, flexShrink: 0 }} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Gold separator ─── */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            height: 1,
            background: colors.separator,
          }}
        />
      </div>

      {/* ─── Copyright ─── */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px 24px 32px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: '0.8rem',
            color: colors.textMuted,
            letterSpacing: '0.04em',
          }}
        >
          &copy; {new Date().getFullYear()} UZquettaStore. All rights reserved.
        </p>
      </div>

      {/* ─── Responsive CSS injected via <style> ─── */}
      <style>{`
        .footer-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 40px !important;
            padding: 60px 24px 36px !important;
          }
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding: 48px 20px 32px !important;
            text-align: center;
          }
          .footer-grid div {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .footer-grid h4 span {
            left: 50% !important;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
