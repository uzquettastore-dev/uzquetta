import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree, Package, Settings, Users, ArrowLeft, LogOut } from 'lucide-react';
import AdminRoute from '../../components/routing/AdminRoute';

import DashboardHome from './DashboardHome';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === `/admin${path}` || currentPath.startsWith(`/admin${path}/`);

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/secure-admin-login');
    };

    return (
        <div className="admin-layout flex min-h-screen bg-bg-color" style={{ paddingTop: '80px' }}>

            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-surface-light h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-2 text-sm text-muted hover:text-primary mb-8 transition-colors font-medium">
                        <ArrowLeft size={16} /> Back to Store
                    </Link>
                    <div className="text-xs uppercase tracking-wider text-muted font-bold mb-4 px-3">Main Menu</div>
                    <nav className="flex flex-col gap-2">
                        <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('') && currentPath === '/admin' ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-main hover:bg-surface-light'}`}>
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                        <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/orders') ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-main hover:bg-surface-light'}`}>
                            <ShoppingBag size={20} /> Orders
                        </Link>
                        <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/products') ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-main hover:bg-surface-light'}`}>
                            <Package size={20} /> Products
                        </Link>
                        <Link to="/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/categories') ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-main hover:bg-surface-light'}`}>
                            <FolderTree size={20} /> Categories
                        </Link>
                        <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/users') ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-main hover:bg-surface-light'}`}>
                            <Users size={20} /> Customers
                        </Link>
                        <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/settings') ? 'bg-primary/20 text-primary border-l-2 border-primary' : 'text-main hover:bg-surface-light'}`}>
                            <Settings size={20} /> Settings
                        </Link>
                    </nav>
                    <div className="mt-8 pt-6 border-t border-surface-light">
                        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors font-bold">
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-10 lg:p-16 overflow-y-auto bg-bg-color min-h-[calc(100vh-80px)]">
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/orders" element={<AdminOrders />} />
                    <Route path="/products" element={<AdminProducts />} />
                    <Route path="/categories" element={<div className="fade-in"><h2 className="text-2xl font-bold">Categories Management</h2><p className="text-muted mt-2">Placeholder for Categories CRUD Table.</p></div>} />
                    <Route path="/users" element={<div className="fade-in"><h2 className="text-2xl font-bold">Customers Database</h2></div>} />
                    <Route path="/settings" element={<div className="fade-in"><h2 className="text-2xl font-bold">Store Settings</h2><p className="text-muted mt-2">Placeholder for updating social links and contact emails.</p></div>} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;
