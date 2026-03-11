import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Edit, Trash2, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('adminInfo'))?.token;
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const token = JSON.parse(localStorage.getItem('adminInfo'))?.token;
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchOrders();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={16} className="text-warning" />;
            case 'Processing': return <Clock size={16} className="text-info" />;
            case 'Shipped': return <Truck size={16} className="text-info" />;
            case 'Delivered': return <CheckCircle size={16} className="text-success" />;
            case 'Cancelled': return <XCircle size={16} className="text-error" />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) return <div className="text-center p-10">Loading orders...</div>;

    return (
        <div className="fade-in pb-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-main">Orders Management</h2>
                    <p className="text-muted mt-2">Manage all customer orders and their fulfillment status.</p>
                </div>
            </div>

            <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-light text-muted uppercase text-xs tracking-wider">
                                <th className="p-4 font-semibold rounded-tl-xl border-b border-surface-light">Order ID</th>
                                <th className="p-4 font-semibold border-b border-surface-light">Customer</th>
                                <th className="p-4 font-semibold border-b border-surface-light">Date</th>
                                <th className="p-4 font-semibold border-b border-surface-light">Payment</th>
                                <th className="p-4 font-semibold border-b border-surface-light">Total Amount</th>
                                <th className="p-4 font-semibold border-b border-surface-light">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-muted">No orders found.</td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="border-b border-surface-light hover:bg-bg-color/50 transition-colors">
                                    <td className="p-4 font-bold">#{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-semibold">{order.customer_name}</div>
                                        <div className="text-xs text-muted">{order.email}</div>
                                        <div className="text-xs text-muted mt-1">{order.phone}</div>
                                    </td>
                                    <td className="p-4 text-muted">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <span className="badge bg-surface-light">{order.payment_method}</span>
                                    </td>
                                    <td className="p-4 font-bold text-primary">Rs. {order.total_amount}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="bg-transparent border border-surface-light rounded text-sm font-semibold p-1 focus:ring-0 cursor-pointer outline-none"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
