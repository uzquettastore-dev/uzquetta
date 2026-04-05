import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Share2, Truck, ShieldCheck, ChevronRight, Zap, RotateCcw } from 'lucide-react';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`);
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

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert(`Successfully added ${quantity}x ${product.name} to your cart!`);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/checkout');
    };

    if (!product) return <div className="container py-16 text-center text-muted">Loading product details...</div>;

    return (
        <div className="product-details-page container py-16 px-6 md:px-12" style={{ marginTop: '40px' }}>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted mb-8">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight size={16} />
                <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
                <ChevronRight size={16} />
                <span className="text-main">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32 items-start">
                {/* Product Image Gallery */}
                <div className="product-gallery flex flex-col md:flex-row-reverse gap-4 md:gap-6 items-start p-2 md:p-6 bg-white rounded-3xl shadow-sm border border-surface-light">
                    <div className="main-image-wrapper rounded-2xl overflow-hidden glass p-2 md:p-4 relative flex-grow w-full">
                        {product.is_sale && (
                            <div className="absolute top-6 left-6 z-10">
                                <span className="badge-yellow-blink">
                                    {product.sale_message || 'SALE'}
                                </span>
                            </div>
                        )}
                        <img src={activeImage} alt={product.name} className="w-full h-auto object-cover rounded-xl shadow-sm transition-transform duration-700 hover:scale-[1.02]" style={{ maxHeight: '650px' }} />
                    </div>
                    {product.image_urls && product.image_urls.length > 1 && (
                        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto custom-scrollbar md:w-24 shrink-0 pb-2 md:pb-0 h-full max-h-[650px]">
                            {product.image_urls.map((url, idx) => (
                                <button
                                    key={idx}
                                    className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === url ? 'border-primary shadow-md transform scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    onClick={() => setActiveImage(url)}
                                >
                                    <img src={url} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info flex flex-col justify-center p-6 md:p-16 bg-white rounded-3xl shadow-sm border border-surface-light">
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
                        <div className="quantity-selector flex items-center border-2 border-surface-light rounded-xl overflow-hidden bg-white w-full sm:col-span-2 md:col-span-1 shadow-sm">
                            <button
                                className="px-5 py-3 text-lg hover:bg-surface-light hover:text-primary transition-colors font-bold"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >-</button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full text-center bg-transparent border-none p-0 focus:ring-0 text-lg font-bold"
                                min="1"
                                max={product.stock}
                            />
                            <button
                                className="px-5 py-3 text-lg hover:bg-surface-light hover:text-primary transition-colors font-bold"
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            >+</button>
                        </div>
                        
                        <div className="flex gap-4 sm:col-span-2 md:col-span-1 justify-end items-center">
                           <button className="btn btn-outline p-3 rounded-xl border-2 border-surface-light text-muted hover:text-error hover:border-error hover:bg-error/5 aspect-square flex items-center justify-center">
                                <Heart size={24} />
                            </button>
                        </div>

                        <button
                            className="btn btn-outline flex-grow text-lg shadow-sm border-2 font-bold py-4 rounded-xl items-center justify-center gap-2"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={22} /> Add to Cart
                        </button>
                        
                        <button
                            className="btn btn-success flex-grow text-lg font-bold py-4 rounded-xl items-center justify-center gap-2"
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
        </div>
    );
};

export default ProductDetailsPage;
