import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Share2, Truck, ShieldCheck, ChevronRight, Zap, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelper';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastExiting, setToastExiting] = useState(false);
    const [imageTransitioning, setImageTransitioning] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'https://uzquetta.vercel.app'}`}`}/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    if (data.image_urls && data.image_urls.length > 0) {
                        setActiveImage(data.image_urls[0]);
                    } else {
                        setActiveImage(data.image_url);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

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
    }, [product]);

    const handleImageSwitch = (url) => {
        if (url === activeImage) return;
        setImageTransitioning(true);
        setTimeout(() => {
            setActiveImage(url);
            setImageTransitioning(false);
        }, 200);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setShowToast(true);
        setToastExiting(false);
        setTimeout(() => {
            setToastExiting(true);
            setTimeout(() => {
                setShowToast(false);
                setToastExiting(false);
            }, 300);
        }, 3000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/checkout');
    };

    // Skeleton Loading State
    if (!product) return (
        <div className="container py-16" style={{ marginTop: '100px' }}>
            {/* Breadcrumb skeleton */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <div className="skeleton" style={{ width: '60px', height: '14px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '80px', height: '14px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '120px', height: '14px', borderRadius: '4px' }}></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div className="skeleton" style={{ aspectRatio: '1/1', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-xl)' }}></div>
                <div>
                    <div className="skeleton" style={{ width: '40%', height: '14px', marginBottom: '1rem', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '70%', height: '28px', marginBottom: '1.5rem', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '50%', height: '24px', marginBottom: '2rem', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '100%', height: '60px', marginBottom: '1rem', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '100%', height: '60px', borderRadius: '4px' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="product-details-page container py-16 px-6 md:px-12" style={{ marginTop: '100px' }}>

            {/* Toast Notification */}
            {showToast && (
                <div className="toast-container">
                    <div className={`toast ${toastExiting ? 'toast-exit' : ''}`}>
                        <div className="toast-icon">
                            <Check size={22} />
                        </div>
                        <div className="toast-message">
                            Added {quantity}x {product.name} to your cart!
                        </div>
                    </div>
                </div>
            )}

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted mb-8" style={{ marginTop: '0px' }}>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight size={16} />
                <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
                <ChevronRight size={16} />
                <span className="text-main">{product.name}</span>
            </nav>

            <div className="pdp-grid grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32 items-start">
                {/* Product Image Gallery */}
                <div className="product-gallery reveal-left flex flex-col md:flex-row-reverse gap-4 md:gap-6 items-start p-2 md:p-6 bg-white rounded-3xl shadow-sm border border-surface-light">
                    <div className="main-image-wrapper rounded-2xl overflow-hidden glass p-2 md:p-4 relative flex-grow w-full">
                        {product.is_sale && (
                            <div className="absolute top-6 left-6 z-10">
                                <span className="badge-yellow-blink">
                                    {product.sale_message || 'SALE'}
                                </span>
                            </div>
                        )}
                        <img
                            src={optimizeCloudinaryUrl(activeImage)}
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-xl shadow-sm"
                            style={{
                                maxHeight: '650px',
                                transition: 'opacity 0.3s ease, transform 0.5s ease',
                                opacity: imageTransitioning ? 0 : 1,
                                transform: imageTransitioning ? 'scale(0.97)' : 'scale(1)',
                            }}
                        />
                    </div>
                    {product.image_urls && product.image_urls.length > 1 && (
                        <div className="pdp-thumbs flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto custom-scrollbar md:w-24 shrink-0 pb-2 md:pb-0 h-full max-h-[650px]">
                            {product.image_urls.map((url, idx) => (
                                <button
                                    key={idx}
                                    className={`pdp-thumb transition-all duration-300 ${activeImage === url ? 'is-active' : ''}`}
                                    onClick={() => handleImageSwitch(url)}
                                    aria-label={`View image ${idx + 1}`}
                                >
                                    <img src={optimizeCloudinaryUrl(url)} alt={`${product.name} ${idx + 1}`} loading="lazy" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info reveal-right flex flex-col justify-center p-6 md:p-16 bg-white rounded-3xl shadow-sm border border-surface-light">
                    <div className="mb-3 text-primary uppercase tracking-widest text-xs font-bold letter-spacing-wide">{product.category_name}</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-5 leading-tight">{product.name}</h1>

                    <div className="flex items-end gap-4 mb-8">
                        {product.is_sale ? (
                            <div className="flex flex-wrap items-baseline gap-3">
                                <span className="text-4xl font-extrabold tracking-tight text-main">Rs. {product.discounted_price}</span>
                                <span className="text-xl text-muted line-through font-medium">Rs. {product.price}</span>
                                <span className="badge bg-error/10 text-error border border-error/20 px-3 py-1.5 ml-1 rounded-full text-xs animate-pulse">Save Rs. {product.price - product.discounted_price}</span>
                            </div>
                        ) : (
                            <span className="text-4xl font-extrabold tracking-tight text-main">Rs. {product.price}</span>
                        )}
                    </div>

                    <p className="text-muted text-lg leading-relaxed mb-8 italic" style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}>{product.description}</p>

                    <div className="stock-info mb-8 flex items-center gap-2 bg-surface-light w-fit px-4 py-2 rounded-full border border-surface-light">
                        <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
                        <span className="font-medium text-sm text-main">{product.stock > 0 ? `${product.stock} in stock - Ready to ship` : 'Out of Stock'}</span>
                    </div>

                    <div className="cart-actions grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {/* Quantity Selector */}
                        <div className="quantity-selector flex items-center border-2 border-surface-light rounded-xl overflow-hidden bg-white w-full sm:col-span-2 md:col-span-1 shadow-sm">
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                aria-label="Decrease quantity"
                            >
                                <Minus size={18} />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full text-center bg-transparent border-none p-0 focus:ring-0 text-lg font-bold"
                                min="1"
                                max={product.stock}
                                style={{ boxShadow: 'none' }}
                            />
                            <button
                                className="qty-btn"
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                aria-label="Increase quantity"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        
                        <div className="flex gap-4 sm:col-span-2 md:col-span-1 justify-end items-center">
                           <button className="btn btn-outline p-3 rounded-xl border-2 border-surface-light text-muted hover:text-error hover:border-error hover:bg-error/5 aspect-square flex items-center justify-center">
                                <Heart size={24} />
                            </button>
                        </div>

                        <button
                            className="pdp-inline-cta btn btn-outline flex-grow text-lg shadow-sm border-2 font-bold py-4 rounded-xl items-center justify-center gap-2"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={22} /> Add to Cart
                        </button>

                        <button
                            className="pdp-inline-cta btn btn-success flex-grow text-lg font-bold py-4 rounded-xl items-center justify-center gap-2"
                            onClick={handleBuyNow}
                            disabled={product.stock === 0}
                        >
                            <Zap size={22} fill="currentColor" /> Buy Now
                        </button>

                    </div>

                    <div className="guarantees grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-surface-light pt-8">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-primary" size={28} />
                            <div>
                                <h4 className="font-semibold text-sm">Secure Checkout</h4>
                                <p className="text-[10px] text-muted">100% Protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Truck className="text-primary" size={28} />
                            <div>
                                <h4 className="font-semibold text-sm">Fast Delivery</h4>
                                <p className="text-[10px] text-muted">Across Pakistan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <RotateCcw className="text-primary" size={28} />
                            <div>
                                <h4 className="font-semibold text-sm">3 Days Return</h4>
                                <p className="text-[10px] text-muted leading-tight">Damaged? Send unboxing video to WhatsApp</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Sticky Buy Bar */}
            <div className="mobile-sticky-buy-bar">
                <button
                    className="mobile-sticky-btn mobile-sticky-btn--cart"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                </button>
                <button
                    className="mobile-sticky-btn mobile-sticky-btn--buy"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                >
                    <Zap size={20} fill="currentColor" />
                    <span>Buy Now</span>
                </button>
            </div>

            <style>{`
                .qty-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 52px;
                    min-height: 52px;
                    background: var(--bg-surface-light);
                    color: var(--text-main);
                    border: none;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                .qty-btn:hover {
                    background: var(--primary);
                    color: white;
                }
                .qty-btn:active {
                    transform: scale(0.92);
                }

                .mobile-sticky-buy-bar {
                    display: none;
                }

                @media (max-width: 767px) {
                    .mobile-sticky-buy-bar {
                        display: flex;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        z-index: 1000;
                        padding: 0.75rem 1rem;
                        gap: 0.75rem;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(16px);
                        -webkit-backdrop-filter: blur(16px);
                        border-top: 1px solid var(--bg-surface-light);
                        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
                    }

                    .mobile-sticky-btn {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        padding: 0.85rem 1rem;
                        border-radius: var(--radius-md);
                        font-family: var(--font-heading);
                        font-weight: 700;
                        font-size: 0.9rem;
                        border: none;
                        cursor: pointer;
                        transition: all var(--transition-fast);
                        min-height: 50px;
                    }

                    .mobile-sticky-btn--cart {
                        background: white;
                        border: 2px solid var(--primary);
                        color: var(--primary);
                    }

                    .mobile-sticky-btn--buy {
                        background: #166534;
                        color: white;
                        border: 1px solid #14532d;
                    }

                    .mobile-sticky-btn:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }

                    /* Add bottom padding to page so content isn't hidden behind sticky bar */
                    .product-details-page {
                        padding-bottom: 100px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductDetailsPage;
