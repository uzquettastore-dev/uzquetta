import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, DollarSign, Clock } from 'lucide-react';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        activeProducts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch real data simultaneously
                const [ordersRes, productsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
                        headers: {
                            Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminInfo'))?.token}`
                        }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`)
                ]);

                if (ordersRes.ok && productsRes.ok) {
                    const orders = await ordersRes.json();
                    const products = await productsRes.json();

                    const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_amount), 0);
                    const pendingOrders = orders.filter(order => order.status === 'Pending').length;

                    setStats({
                        totalOrders: orders.length,
                        totalRevenue: totalRevenue,
                        pendingOrders: pendingOrders,
                        activeProducts: products.length
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-muted">Loading Analytics...</div>;

    return (
        <div className="fade-in pb-12">
            <h2 className="text-3xl font-bold mb-2 text-main">Store Overview</h2>
            <p className="text-muted mb-8 text-sm">Welcome back to the UZquettaStore admin panel.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-surface p-6 rounded-2xl border border-surface-light shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-main">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-surface-light shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-main">Rs. {stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-surface-light shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted mb-1">Pending Orders</p>
                        <p className="text-3xl font-bold text-main">{stats.pendingOrders}</p>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-surface-light shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-main">{stats.activeProducts}</p>
                    </div>
                </div>

            </div>

            {/* Can add quick recent orders table here in future */}
        </div>
    );
};

export default DashboardHome;
