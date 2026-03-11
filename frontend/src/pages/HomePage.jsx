import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Clock } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch featured products (for now just latest products)
                const prodRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setFeaturedProducts(prodData.slice(0, 8)); // Show 8 latest products
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
                        <div className="feature-icon"><Truck size={32} /></div>
                        <div>
                            <h3>Nationwide Delivery</h3>
                            <p className="text-muted">Fast & secure delivery across Pakistan</p>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="product-card-minimal group relative fade-in">
                            <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                                {product.is_sale && (
                                    <div className="absolute bottom-4 left-4 z-10">
                                        <span className="badge badge-sale badge-new-in">{product.sale_message || 'NEW IN'}</span>
                                    </div>
                                )}
                                {!product.is_sale && (
                                     <div className="absolute bottom-4 left-4 z-10">
                                        <span className="badge badge-sale badge-new-in">NEW IN</span>
                                    </div>
                                )}
                                <img src={product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : product.image_url} alt={product.name} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
                            </Link>
                            <div className="pt-4 pb-6 px-4 flex flex-col items-center bg-white">
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="text-sm uppercase tracking-wider font-semibold mb-1 text-truncate hover:text-primary transition-colors">{product.name}</h3>
                                </Link>
                                <div className="flex items-center gap-2">
                                    {product.is_sale ? (
                                        <>
                                            <span className="text-sm font-semibold">Rs.{product.discounted_price}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-semibold">Rs.{product.price}</span>
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
