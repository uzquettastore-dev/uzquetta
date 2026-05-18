import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Clock, RotateCcw } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelper';
import './HomePage.css';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch featured products (limit to latest 8 products for optimal speed)
                const prodRes = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'https://uzquetta.vercel.app'}`}`}/api/products?limit=8`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setFeaturedProducts(prodData); // Query ordered by created_at DESC, so it is already newest first
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content fade-in">
                    <h1 className="hero-title">Discover Premium Essentials</h1>
                    <p className="hero-subtitle">Explore a wide variety of high-quality products across all categories, delivered right to your doorstep.</p>
                    <div className="hero-actions gap-4 flex flex-col sm:flex-row mt-6 w-full px-6 sm:px-0 sm:w-auto">
                        <Link to="/products" className="btn btn-primary btn-lg w-full sm:w-auto justify-center">Shop Now <ArrowRight size={20} /></Link>
                        <Link to="/products?category=sale" className="btn btn-outline btn-lg glass w-full sm:w-auto justify-center">View Offers</Link>
                    </div>
                </div>
            </section>

            {/* Features Banner */}
            <section className="features-banner glass slide-up">
                <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="feature-item flex items-center gap-4">
                        <div className="feature-icon"><RotateCcw size={32} /></div>
                        <div>
                            <h3>3 Days Return Policy</h3>
                            <p className="text-muted">Damaged? Send unboxing video to WhatsApp</p>
                        </div>
                    </div>
                    <div className="feature-item flex items-center gap-4">
                        <div className="feature-icon"><Shield size={32} /></div>
                        <div>
                            <h3>Secure Payments</h3>
                            <p className="text-muted">EasyPaisa, Bank Transfer & COD available</p>
                        </div>
                    </div>
                    <div className="feature-item flex items-center gap-4">
                        <div className="feature-icon"><Star size={32} /></div>
                        <div>
                            <h3>Premium Quality</h3>
                            <p className="text-muted">100% authentic and high-quality products</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-section py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="product-card-minimal group relative fade-in">
                            <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
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
                                <div className="flex items-center justify-center gap-2 mt-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                    {product.discounted_price ? (
                                        <>
                                            <span className="text-[0.85rem] text-gray-500 line-through font-normal">{Number(product.price).toFixed(2)} PKR</span>
                                            <span className="text-black tracking-tight" style={{ fontWeight: 900, fontSize: '1.2rem', textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>{Number(product.discounted_price).toFixed(2)} PKR</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-[0.85rem] text-gray-500 line-through font-normal">{(Number(product.price) + 500).toFixed(2)} PKR</span>
                                            <span className="text-black tracking-tight" style={{ fontWeight: 900, fontSize: '1.2rem', textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>{Number(product.price).toFixed(2)} PKR</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
