import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus, ShieldCheck, Package } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const [removingId, setRemovingId] = useState(null);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryCharges = cartItems.length > 0 ? Math.max(...cartItems.map(item => item.delivery_charges)) : 0;
    const total = subtotal + deliveryCharges;

    // Scroll-reveal observer
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
    }, [cartItems]);

    const handleRemove = useCallback((productId) => {
        setRemovingId(productId);
        setTimeout(() => {
            removeFromCart(productId);
            setRemovingId(null);
        }, 400);
    }, [removeFromCart]);

    if (cartItems.length === 0) {
        return (
            <div className="cart-page-empty" style={{ marginTop: '100px', minHeight: '60vh' }}>
                <div className="container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    paddingTop: '4rem',
                    paddingBottom: '4rem',
                    minHeight: '60vh'
                }}>
                    {/* Animated Shopping Bag Icon */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
                        border: '2px solid rgba(212, 175, 55, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        animation: 'bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}>
                        <ShoppingBag size={56} style={{ color: 'var(--primary)' }} />
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                        fontWeight: 800,
                        marginBottom: '0.75rem',
                        animation: 'fadeIn 0.6s 0.2s both'
                    }}>Your Cart is Empty</h2>

                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.05rem',
                        maxWidth: '400px',
                        marginBottom: '2.5rem',
                        lineHeight: 1.7,
                        animation: 'fadeIn 0.6s 0.4s both'
                    }}>Looks like you haven't added anything to your cart yet. Explore our premium collection.</p>

                    <Link
                        to="/products"
                        className="btn btn-primary"
                        style={{
                            padding: '1rem 2.5rem',
                            fontSize: '1rem',
                            letterSpacing: '0.04em',
                            animation: 'fadeIn 0.6s 0.6s both'
                        }}
                    >
                        <ShoppingBag size={18} />
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page" style={{ marginTop: '100px' }}>
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

                {/* Page Title */}
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 className="section-title" style={{ display: 'inline-block' }}>Shopping Cart</h1>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem',
                        marginTop: '0.5rem'
                    }}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                {/* Main Grid: Cart Items + Order Summary */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '2.5rem'
                }} className="cart-grid">

                    {/* Cart Items Column */}
                    <div className="cart-items-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {cartItems.map((item, index) => (
                            <div
                                key={item.product_id}
                                className={`reveal stagger-${Math.min(index + 1, 8)} cart-item-card`}
                                style={{
                                    background: 'var(--bg-surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--secondary-light)',
                                    padding: '1.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: 'var(--shadow-sm)',
                                    ...(removingId === item.product_id ? {
                                        opacity: 0,
                                        transform: 'translateX(-100%)',
                                        maxHeight: 0,
                                        padding: 0,
                                        marginBottom: '-1.25rem',
                                        overflow: 'hidden'
                                    } : {})
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    {/* Product Image */}
                                    <Link to={`/product/${item.product_id}`} style={{ flexShrink: 0 }}>
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: 'var(--radius-md)',
                                                boxShadow: 'var(--shadow-sm)',
                                                transition: 'transform 0.3s ease'
                                            }}
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                            <Link
                                                to={`/product/${item.product_id}`}
                                                style={{
                                                    fontFamily: 'var(--font-heading)',
                                                    fontSize: '1.05rem',
                                                    fontWeight: 600,
                                                    lineHeight: 1.4,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    transition: 'color 0.25s ease'
                                                }}
                                                className="cart-item-name"
                                            >
                                                {item.name}
                                            </Link>
                                            <button
                                                onClick={() => handleRemove(item.product_id)}
                                                aria-label="Remove item"
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    minWidth: '36px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--text-muted)',
                                                    transition: 'all 0.25s ease',
                                                    flexShrink: 0
                                                }}
                                                className="cart-remove-btn"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <span style={{
                                                fontFamily: 'var(--font-heading)',
                                                fontWeight: 700,
                                                fontSize: '1.1rem',
                                                color: 'var(--text-main)'
                                            }}>Rs. {item.price}</span>
                                            {item.original_price > item.price && (
                                                <span style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-muted)',
                                                    textDecoration: 'line-through'
                                                }}>Rs. {item.original_price}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Controls & Line Total */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px solid var(--secondary-light)',
                                    paddingTop: '1rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0',
                                        border: '1px solid var(--secondary-light)',
                                        borderRadius: 'var(--radius-md)',
                                        overflow: 'hidden',
                                        background: 'var(--bg-surface-light)'
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                            aria-label="Decrease quantity"
                                            style={{
                                                width: '44px',
                                                height: '44px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                transition: 'all 0.25s ease',
                                                color: 'var(--text-main)'
                                            }}
                                            className="qty-btn"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span style={{
                                            width: '44px',
                                            height: '44px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '1rem',
                                            fontFamily: 'var(--font-heading)',
                                            background: 'var(--bg-surface)',
                                            borderLeft: '1px solid var(--secondary-light)',
                                            borderRight: '1px solid var(--secondary-light)'
                                        }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                            aria-label="Increase quantity"
                                            style={{
                                                width: '44px',
                                                height: '44px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                transition: 'all 0.25s ease',
                                                color: 'var(--text-main)'
                                            }}
                                            className="qty-btn"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <span style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontWeight: 700,
                                        fontSize: '1.15rem',
                                        color: 'var(--primary-dark)'
                                    }}>Rs. {item.price * item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-col reveal-right">
                        <div
                            className="order-summary-sticky"
                            style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid rgba(212, 175, 55, 0.25)',
                                padding: '2rem',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(212, 175, 55, 0.1)'
                            }}
                        >
                            {/* Gold accent line at top */}
                            <div style={{
                                width: '100%',
                                height: '3px',
                                background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                                borderRadius: '2px',
                                marginBottom: '1.5rem'
                            }} />

                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.35rem',
                                fontWeight: 700,
                                marginBottom: '1.5rem',
                                paddingBottom: '1rem',
                                borderBottom: '1px solid var(--secondary-light)'
                            }}>Order Summary</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Subtotal ({cartItems.length} items)</span>
                                    <span style={{ fontWeight: 600 }}>Rs. {subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <Package size={14} />
                                        Delivery Charges
                                    </span>
                                    <span style={{
                                        fontWeight: 600,
                                        color: deliveryCharges === 0 ? 'var(--success)' : 'inherit'
                                    }}>{deliveryCharges === 0 ? 'Free' : `Rs. ${deliveryCharges}`}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div style={{
                                borderTop: '2px solid var(--secondary-light)',
                                paddingTop: '1.25rem',
                                marginBottom: '2rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <span style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.1rem',
                                        fontWeight: 700
                                    }}>Total</span>
                                    <span style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.75rem',
                                        fontWeight: 800,
                                        color: 'var(--primary)',
                                        lineHeight: 1
                                    }}>Rs. {total}</span>
                                </div>
                                <p style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--text-muted)',
                                    textAlign: 'right',
                                    marginTop: '0.35rem'
                                }}>Including all taxes</p>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                to="/checkout"
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    letterSpacing: '0.04em',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} style={{ transition: 'transform 0.3s ease' }} className="checkout-arrow" />
                            </Link>

                            {/* Secure Checkout Badge */}
                            <div style={{
                                marginTop: '1.25rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)'
                            }}>
                                <ShieldCheck size={15} style={{ color: 'var(--success)' }} />
                                <span style={{ fontWeight: 600 }}>Secure Checkout</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Scoped Styles */}
            <style>{`
                /* Desktop grid layout */
                @media (min-width: 1024px) {
                    .cart-grid {
                        grid-template-columns: 1fr 380px !important;
                    }
                    .order-summary-sticky {
                        position: sticky;
                        top: 100px;
                    }
                }

                /* Cart item card hover */
                .cart-item-card:hover {
                    border-color: rgba(212, 175, 55, 0.4) !important;
                    box-shadow: var(--shadow-md), 0 0 0 1px rgba(212, 175, 55, 0.08) !important;
                }

                /* Cart item name hover */
                .cart-item-name:hover {
                    color: var(--primary) !important;
                }

                /* Remove button hover */
                .cart-remove-btn:hover {
                    color: var(--error) !important;
                    background: rgba(239, 68, 68, 0.08) !important;
                }

                /* Quantity button hover */
                .qty-btn:hover {
                    background: var(--primary) !important;
                    color: white !important;
                }

                /* Cart item image hover */
                .cart-item-card img:hover {
                    transform: scale(1.05);
                }

                /* Checkout arrow hover */
                .btn-primary:hover .checkout-arrow {
                    transform: translateX(4px);
                }

                /* Mobile responsive */
                @media (max-width: 767px) {
                    .cart-grid {
                        gap: 2rem !important;
                    }
                    .order-summary-sticky {
                        padding: 1.5rem !important;
                    }
                }

                /* Tablet */
                @media (min-width: 768px) and (max-width: 1023px) {
                    .cart-grid {
                        grid-template-columns: 1fr !important;
                        max-width: 680px;
                        margin: 0 auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default CartPage;
