import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryCharges = cartItems.length > 0 ? Math.max(...cartItems.map(item => item.delivery_charges)) : 0;
    const total = subtotal + deliveryCharges;

    if (cartItems.length === 0) {
        return (
            <div className="container py-24 flex flex-col items-center justify-center text-center" style={{ minHeight: '60vh', marginTop: '40px' }}>
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 border border-surface-light">
                    <ShoppingBag size={48} className="text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-muted mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products" className="btn btn-primary px-8 py-3 w-fit">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-16" style={{ marginTop: '40px' }}>
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map(item => (
                        <div key={item.product_id} className="cart-item glass p-4 rounded-xl flex flex-col sm:flex-row items-center gap-6">
                            <Link to={`/product/${item.product_id}`} className="shrink-0">
                                <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                            </Link>

                            <div className="flex-grow flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <Link to={`/product/${item.product_id}`} className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2">
                                        {item.name}
                                    </Link>
                                    <button onClick={() => removeFromCart(item.product_id)} className="text-muted hover:text-error transition-colors p-1">
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg">Rs. {item.price}</span>
                                        {item.original_price > item.price && (
                                            <span className="text-xs text-muted line-through">Rs. {item.original_price}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center border border-surface-light rounded-md bg-surface">
                                        <button
                                            className="px-3 py-1 hover:text-primary transition-colors text-lg"
                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                        >-</button>
                                        <span className="px-2 font-medium w-8 text-center">{item.quantity}</span>
                                        <button
                                            className="px-3 py-1 hover:text-primary transition-colors text-lg"
                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="order-summary h-fit">
                    <div className="glass p-6 rounded-xl border border-primary/20 bg-primary/5">
                        <h2 className="text-xl font-bold mb-6 pb-4 border-b border-surface-light">Order Summary</h2>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted">Subtotal ({cartItems.length} items)</span>
                                <span className="font-semibold">Rs. {subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Delivery Charges</span>
                                <span className="font-semibold">{deliveryCharges === 0 ? 'Free' : `Rs. ${deliveryCharges}`}</span>
                            </div>
                        </div>

                        <div className="border-t border-surface-light pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-black text-primary">Rs. {total}</span>
                            </div>
                            <p className="text-xs text-muted text-right mt-1 cursor-pointer hover:underline">Including all taxes</p>
                        </div>

                        <Link to="/checkout" className="btn btn-primary w-full py-4 text-base tracking-wide flex justify-center items-center gap-2 group">
                            Proceed to Checkout
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="mt-4 flex justify-center items-center gap-2 text-xs text-muted">
                            <span className="font-semibold">Secure Checkout</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;
