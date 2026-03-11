import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Share2, Truck, ShieldCheck, ChevronRight } from 'lucide-react';

const ProductDetailsPage = () => {
    const { id } = useParams();
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

    if (!product) return <div className="container py-16 text-center">Loading...</div>;

    return (
        <div className="product-details-page container py-16" style={{ marginTop: '40px' }}>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted mb-8">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight size={16} />
                <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
                <ChevronRight size={16} />
                <span className="text-main">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Image Gallery */}
                <div className="product-gallery">
                    <div className="main-image-wrapper rounded-xl overflow-hidden glass p-4 relative mb-4">
                        {product.is_sale && (
                            <div className="absolute top-6 left-6 z-10">
                                <span className="badge badge-sale">{product.sale_message || 'SALE'}</span>
                            </div>
                        )}
                        <img src={activeImage} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-sm" style={{ maxHeight: '600px' }} />
                    </div>
                    {product.image_urls && product.image_urls.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {product.image_urls.map((url, idx) => (
                                <button
                                    key={idx}
                                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === url ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    onClick={() => setActiveImage(url)}
                                >
                                    <img src={url} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info flex flex-col justify-center">
                    <div className="mb-2 text-primary_light uppercase tracking-wider text-sm font-bold">{product.category_name}</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        {product.is_sale ? (
                            <>
                                <span className="text-3xl font-bold tracking-tight text-primary">Rs. {product.discounted_price}</span>
                                <span className="text-xl text-muted line-through">Rs. {product.price}</span>
                                <span className="badge bg-green-500/10 text-success border border-success px-2 py-1 ml-2">Save Rs. {product.price - product.discounted_price}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold tracking-tight">Rs. {product.price}</span>
                        )}
                    </div>

                    <p className="text-muted text-lg leading-relaxed mb-8">{product.description}</p>

                    <div className="stock-info mb-6 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-success' : 'bg-error'}`}></div>
                        <span className="font-medium text-sm">{product.stock > 0 ? `${product.stock} in stock - Ready to ship` : 'Out of Stock'}</span>
                    </div>

                    <div className="cart-actions flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="quantity-selector flex items-center border border-surface-light rounded-md overflow-hidden bg-surface w-fit">
                            <button
                                className="px-4 py-3 hover:bg-surface-light hover:text-primary transition-colors"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >-</button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-16 text-center bg-transparent border-none p-0 focus:ring-0"
                                min="1"
                                max={product.stock}
                            />
                            <button
                                className="px-4 py-3 hover:bg-surface-light hover:text-primary transition-colors"
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            >+</button>
                        </div>

                        <button
                            className="btn btn-primary flex-grow text-lg shadow-lg hover:shadow-primary/30"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={20} /> Add to Cart
                        </button>

                        <button className="btn btn-outline p-3 rounded-md border-surface-light text-muted hover:text-secondary hover:border-secondary">
                            <Heart size={24} />
                        </button>
                    </div>

                    {/* Guarantee Badges */}
                    <div className="guarantees grid grid-cols-2 gap-4 border-t border-surface-light pt-8">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-primary" size={28} />
                            <div>
                                <h4 className="font-semibold text-sm">Secure Checkout</h4>
                                <p className="text-xs text-muted">100% Protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Truck className="text-primary" size={28} />
                            <div>
                                <h4 className="font-semibold text-sm">Fast Delivery</h4>
                                <p className="text-xs text-muted">Across Pakistan</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
