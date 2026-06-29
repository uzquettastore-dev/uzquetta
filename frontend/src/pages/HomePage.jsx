import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Clock, RotateCcw } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelper';
import './HomePage.css';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch featured products (limit to latest 3 products for optimal speed)
                const prodRes = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'https://uzquetta.vercel.app'}`}`}/api/products?limit=3`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setFeaturedProducts(prodData); // Query ordered by created_at DESC, so it is already newest first
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
    }, [featuredProducts]);

    const marqueeContent = 'Premium Quality ★ Secure Payments ★ 3 Days Return Policy ★ 100% Authentic Products ★ Cash on Delivery Available';

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-gradient-bg"></div>
                <div className="hero-overlay"></div>

                {/* Floating decorative shapes */}
                <div className="hero-float hero-float-1"></div>
                <div className="hero-float hero-float-2"></div>
                <div className="hero-float hero-float-3"></div>

                <div className="container hero-content">
                    <h1 className="hero-title hero-animate hero-animate-1">
                        Discover Premium Essentials
                    </h1>
                    <p className="hero-subtitle hero-animate hero-animate-2">
                        Explore a wide variety of high-quality products across all categories, delivered right to your doorstep.
                    </p>
                    <div className="hero-actions hero-animate hero-animate-3">
                        <Link to="/products" className="btn btn-primary btn-lg">Shop Now <ArrowRight size={20} /></Link>
                        <Link to="/products?category=sale" className="btn btn-outline btn-lg glass">View Offers</Link>
                    </div>
                </div>
            </section>

            {/* Features Banner */}
            <section className="features-banner reveal">
                <div className="container features-grid">
                    <div className="feature-item reveal stagger-1">
                        <div className="feature-icon-circle">
                            <RotateCcw size={28} />
                        </div>
                        <div>
                            <h3>3 Days Return Policy</h3>
                            <p className="text-muted">Damaged? Send unboxing video to WhatsApp</p>
                        </div>
                    </div>
                    <div className="feature-item reveal stagger-2">
                        <div className="feature-icon-circle">
                            <Shield size={28} />
                        </div>
                        <div>
                            <h3>Secure Payments</h3>
                            <p className="text-muted">EasyPaisa, Bank Transfer &amp; COD available</p>
                        </div>
                    </div>
                    <div className="feature-item reveal stagger-3">
                        <div className="feature-icon-circle">
                            <Star size={28} />
                        </div>
                        <div>
                            <h3>Premium Quality</h3>
                            <p className="text-muted">100% authentic and high-quality products</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Marquee Strip */}
            <div className="marquee-strip">
                <div className="marquee-inner">
                    <span>{marqueeContent}</span>
                    <span>{marqueeContent}</span>
                    <span>{marqueeContent}</span>
                    <span>{marqueeContent}</span>
                </div>
            </div>

            {/* Featured Products */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-title-wrapper">
                        <h2 className="section-title">New Arrivals</h2>
                    </div>

                    <div className="homepage-products-grid">
                        {loading ? (
                            /* Skeleton Loading Cards */
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="product-card-minimal skeleton-card">
                                    <div className="skeleton skeleton-image"></div>
                                    <div style={{ padding: '1rem' }}>
                                        <div className="skeleton skeleton-text"></div>
                                        <div className="skeleton skeleton-text-sm"></div>
                                        <div className="skeleton skeleton-text" style={{ width: '50%', marginTop: '0.75rem' }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            featuredProducts.map((product, index) => (
                                <div key={product.id} className={`product-card-minimal group relative reveal stagger-${(index % 8) + 1}`}>
                                    <Link to={`/product/${product.id}`} className="block relative overflow-hidden product-image-wrapper">
                                        {product.is_sale && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="badge-yellow-blink">
                                                    {product.sale_message || 'SALE'}
                                                </span>
                                            </div>
                                        )}
                                        {!product.is_sale && (
                                             <div className="absolute top-3 left-3 z-10">
                                                <span className="badge-yellow-blink">
                                                    NEW IN
                                                </span>
                                            </div>
                                        )}
                                        <img src={product.image_urls && product.image_urls.length > 0 ? optimizeCloudinaryUrl(product.image_urls[0]) : optimizeCloudinaryUrl(product.image_url)} alt={product.name} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ aspectRatio: '3/4' }} />
                                        <div className="product-image-overlay"></div>
                                    </Link>
                                    <div className="pt-4 pb-6 px-4 flex flex-col items-center bg-white flex-grow justify-between">
                                        <div className="text-center w-full">
                                            <Link to={`/product/${product.id}`}>
                                                <h3 className="text-sm text-center mx-auto tracking-widest font-bold mb-1 text-truncate hover:text-primary transition-colors text-main uppercase" style={{ fontFamily: 'var(--font-heading)' }}>{product.name}</h3>
                                            </Link>
                                            {product.description && (
                                                <p className="text-[0.8rem] text-muted mb-3 line-clamp-2 w-full overflow-hidden leading-relaxed italic" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{product.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-center gap-3 mt-auto" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                                            {product.discounted_price ? (
                                                <>
                                                    <span className="text-[0.8rem] text-gray-400 line-through font-normal">Rs. {Math.round(product.price).toLocaleString()}</span>
                                                    <span className="text-main tracking-tight font-extrabold text-[1.1rem]">Rs. {Math.round(product.discounted_price).toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[0.8rem] text-gray-400 line-through font-normal">Rs. {Math.round(Number(product.price) + 500).toLocaleString()}</span>
                                                    <span className="text-main tracking-tight font-extrabold text-[1.1rem]">Rs. {Math.round(product.price).toLocaleString()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* View All Products Button */}
                    <div className="view-all-wrapper reveal">
                        <Link to="/products" className="btn btn-outline view-all-btn">
                            View All Products <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
