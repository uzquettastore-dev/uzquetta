import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, CreditCard, Banknote, Upload, ShieldCheck } from 'lucide-react';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [finalOrderTotal, setFinalOrderTotal] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'COD'
    });
    const [screenshot, setScreenshot] = useState(null);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryCharges = cartItems.length > 0 ? Math.max(...cartItems.map(item => item.delivery_charges)) : 0;
    const total = subtotal + deliveryCharges;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('customer_name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('address', formData.address + ', ' + formData.city);
        data.append('paymentMethod', formData.paymentMethod);
        data.append('delivery_charges', deliveryCharges);

        const items = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));
        data.append('orderItems', JSON.stringify(items));

        if ((formData.paymentMethod === 'EasyPaisa' || formData.paymentMethod === 'JazzCash') && screenshot) {
            data.append('screenshot', screenshot);
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
                method: 'POST',
                body: data
            });

            if (res.ok) {
                setFinalOrderTotal(total);
                clearCart();
                setStep(3);
            } else {
                const errData = await res.json();
                alert(`Error placing order: ${errData.message}`);
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Failed to place order. Connection error.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="container py-16" style={{ marginTop: '40px', maxWidth: '1000px' }}>

            {/* Checkout Steps */}
            {step < 3 && (
                <div className="flex justify-center mb-12">
                    <div className="flex items-center w-full max-w-md">
                        <div className={`flex flex-col items-center relative z-10 ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step >= 1 ? 'bg-primary shadow-glow' : 'bg-surface-light border border-muted'}`}>1</div>
                            <span className="text-sm font-semibold mt-2 absolute -bottom-6 whitespace-nowrap">Shipping</span>
                        </div>
                        <div className={`flex-grow h-1 mx-2 transition-colors duration-300 ${step >= 2 ? 'bg-primary' : 'bg-surface-light'}`}></div>
                        <div className={`flex flex-col items-center relative z-10 ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step >= 2 ? 'bg-primary shadow-glow' : 'bg-surface-light border border-muted'}`}>2</div>
                            <span className="text-sm font-semibold mt-2 absolute -bottom-6 whitespace-nowrap">Payment</span>
                        </div>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Shipping Form */}
                    <div className="glass p-8 rounded-2xl border border-surface-light fade-in">
                        <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                        <form onSubmit={handleNextStep} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-main mb-1.5 ml-1">Full Name</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ahmed Khan" className="bg-white border-2 border-surface-light rounded-xl hover:border-primary/50 transition-colors shadow-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-main mb-1.5 ml-1">Email</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="ahmed@example.pk" className="bg-white border-2 border-surface-light rounded-xl hover:border-primary/50 transition-colors shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-main mb-1.5 ml-1">Phone</label>
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0300 1234567" className="bg-white border-2 border-surface-light rounded-xl hover:border-primary/50 transition-colors shadow-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-main mb-1.5 ml-1">Complete Address</label>
                                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="3" placeholder="House #, Street, Block..." className="bg-white border-2 border-surface-light rounded-xl hover:border-primary/50 transition-colors shadow-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-main mb-1.5 ml-1">City</label>
                                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Karachi" className="bg-white border-2 border-surface-light rounded-xl hover:border-primary/50 transition-colors shadow-sm" />
                            </div>
                            <button type="submit" className="btn btn-primary w-full mt-6 py-4">Continue to Payment</button>
                        </form>
                    </div>

                    {/* Mini Cart Summary */}
                    <div className="fade-in">
                        <div className="bg-surface p-6 rounded-2xl border border-surface-light sticky top-28">
                            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                            <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.product_id} className="flex gap-4 items-center bg-white p-3 rounded-xl shadow-sm border border-surface-light">
                                        <div className="relative shrink-0">
                                            <img 
                                                src={item.image_url?.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image_url}`} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded-lg shadow-sm border border-surface-light" 
                                            />
                                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 flex justify-center items-center rounded-full shadow-md z-10 border-2 border-white">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-sm text-main truncate pr-2">{item.name}</p>
                                            <p className="text-xs text-muted mt-1 uppercase tracking-wide">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-extrabold text-[#d4af37] tracking-tight">Rs. {item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-surface-light pt-4 space-y-2 text-sm text-muted">

                                <div className="flex justify-between items-center text-main font-medium"><span>Subtotal:</span><span>Rs. {subtotal}</span></div>
                                <div className="flex justify-between items-center text-main font-medium"><span>Delivery:</span><span>Rs. {deliveryCharges}</span></div>
                                <div className="flex justify-between items-end font-black text-2xl text-main mt-4 border-t border-surface-light pt-4 pb-2">
                                    <span className="text-lg">Total</span>
                                    <span className="text-primary flex items-baseline gap-1"><span className="text-xs font-bold text-muted mr-1">PKR</span>Rs. {total}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {step === 2 && (
                <div className="max-w-3xl mx-auto glass p-8 rounded-2xl border border-surface-light slide-up">
                    <h2 className="text-2xl font-bold mb-1 border-b border-surface-light pb-4">Select Payment Method</h2>
                    <p className="text-muted mb-6 text-sm">All transactions are secure and encrypted.</p>

                    <form onSubmit={handlePlaceOrder}>
                        <div className="space-y-4 mb-8">

                            {/* COD Option */}
                            <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-surface-light hover:border-primary/50'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={handleInputChange} className="w-5 h-5 text-primary" />
                                    <Banknote className={formData.paymentMethod === 'COD' ? 'text-primary' : 'text-muted'} />
                                    <span className="font-semibold text-lg">Cash on Delivery (COD)</span>
                                </div>
                                {formData.paymentMethod === 'COD' && (
                                    <p className="ml-8 mt-2 text-sm text-muted slide-up">Pay directly to our rider when your order arrives. Please keep exact change ready.</p>
                                )}
                            </label>

                            {/* EasyPaisa Option */}
                            <label className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'EasyPaisa' ? 'border-primary bg-primary/5 shadow-md transform scale-[1.02]' : 'border-surface-light hover:border-primary/30'}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <input type="radio" name="paymentMethod" value="EasyPaisa" checked={formData.paymentMethod === 'EasyPaisa'} onChange={handleInputChange} className="w-5 h-5 text-primary accent-primary" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg text-main">EasyPaisa</span>
                                            <span className="text-xs text-muted">Mobile Wallet Transfer</span>
                                        </div>
                                    </div>
                                    <img src="/Easypaisa-app-logo-vector.png" alt="EasyPaisa" className="h-5 object-contain" style={{ maxWidth: '100px' }} />
                                </div>
                                {formData.paymentMethod === 'EasyPaisa' && (
                                    <div className="ml-9 mt-5 slide-up border-t border-primary/20 pt-5">
                                        <p className="text-sm mb-3 text-main">Please transfer <strong className="text-primary font-black">Rs. {total}</strong> to the following EasyPaisa account:</p>
                                        <div className="bg-white p-4 rounded-xl mb-5 text-center border border-primary/20 shadow-inner">
                                            <p className="font-black text-2xl tracking-widest text-main mb-1">0312 3456789</p>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Account Title: UZquettaStore</p>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-3">Upload Payment Screenshot <span className="text-error">*</span></label>
                                            <div className="border-2 border-dashed border-surface-light rounded-xl p-6 flex flex-col items-center justify-center bg-white/50 relative hover:border-primary/50 transition-colors group">
                                                <Upload className="text-muted mb-2 group-hover:text-primary transition-colors" size={24} />
                                                <span className="text-sm font-medium text-main text-center">{screenshot ? screenshot.name : 'Click to upload screenshot'}</span>
                                                <span className="text-[10px] text-muted mt-1 uppercase">JPG, PNG up to 5MB</span>
                                                <input required type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </label>

                            {/* JazzCash Option */}
                            <label className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'JazzCash' ? 'border-primary bg-primary/5 shadow-md transform scale-[1.02]' : 'border-surface-light hover:border-primary/30'}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <input type="radio" name="paymentMethod" value="JazzCash" checked={formData.paymentMethod === 'JazzCash'} onChange={handleInputChange} className="w-5 h-5 text-primary accent-primary" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg text-main">JazzCash</span>
                                            <span className="text-xs text-muted">Mobile Wallet Transfer</span>
                                        </div>
                                    </div>
                                    <img src="/JazzCash-2025-Logo-PNG-Vector.png" alt="JazzCash" className="h-5 object-contain" style={{ maxWidth: '100px' }} />
                                </div>
                                {formData.paymentMethod === 'JazzCash' && (
                                    <div className="ml-9 mt-5 slide-up border-t border-primary/20 pt-5">
                                        <p className="text-sm mb-3 text-main">Please transfer <strong className="text-primary font-black">Rs. {total}</strong> to the following JazzCash account:</p>
                                        <div className="bg-white p-4 rounded-xl mb-5 text-center border border-primary/20 shadow-inner">
                                            <p className="font-black text-2xl tracking-widest text-main mb-1">0312 3456789</p>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-primary">Account Title: UZquettaStore</p>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-3">Upload Payment Screenshot <span className="text-error">*</span></label>
                                            <div className="border-2 border-dashed border-surface-light rounded-xl p-6 flex flex-col items-center justify-center bg-white/50 relative hover:border-primary/50 transition-colors group">
                                                <Upload className="text-muted mb-2 group-hover:text-primary transition-colors" size={24} />
                                                <span className="text-sm font-medium text-main text-center">{screenshot ? screenshot.name : 'Click to upload screenshot'}</span>
                                                <span className="text-[10px] text-muted mt-1 uppercase">JPG, PNG up to 5MB</span>
                                                <input required type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </label>

                        </div>

                        <div className="flex justify-between items-center">
                            <button type="button" onClick={() => setStep(1)} className="btn btn-outline border-none text-muted hover:text-white">Back to Shipping</button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn btn-primary px-8 py-3 text-lg flex gap-2 items-center justify-center min-w-[200px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} /> Complete Order
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-2xl mx-auto text-center fade-in" style={{ paddingTop: '80px', minHeight: '60vh' }}>
                    <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-success" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4">Order Confirmed!</h1>
                    <p className="text-xl text-muted mb-8">Thank you, {formData.name}. Your order has been placed successfully.</p>
                    <div className="glass p-6 rounded-xl inline-block text-left mb-8 min-w-[300px]">
                        <p className="text-sm text-muted mb-1">Order Status:</p>
                        <p className="font-bold text-primary mb-4">Pending Verification</p>

                        <p className="text-sm text-muted mb-1">Total Amount:</p>
                        <p className="font-bold text-2xl text-main font-black tracking-tight">Rs. {finalOrderTotal}</p>
                    </div>
                    <br />
                    <button onClick={() => navigate('/products')} className="btn btn-primary px-8 py-3">Continue Shopping</button>
                </div>
            )}

        </div>
    );
};

export default CheckoutPage;
