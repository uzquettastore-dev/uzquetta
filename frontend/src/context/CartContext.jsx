import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.product_id === product.id);
            let newCart;
            // Use discounted_price if available, otherwise price
            const priceToUse = product.discounted_price || product.price;

            if (existing) {
                newCart = prev.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newCart = [...prev, {
                    product_id: product.id,
                    name: product.name,
                    image_url: product.image_url,
                    price: priceToUse,
                    original_price: product.price,
                    quantity: quantity,
                    delivery_charges: product.delivery_charges || 0
                }];
            }
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);

        setCartItems(prev => {
            const newCart = prev.map(item =>
                item.product_id === productId ? { ...item, quantity } : item
            );
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => {
            const newCart = prev.filter(item => item.product_id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(newCart));
            return newCart;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
