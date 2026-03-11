import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok && data.role === 'admin') {
                // Store admin token (in real app using Context/Redux)
                localStorage.setItem('adminInfo', JSON.stringify(data));
                navigate('/admin');
            } else {
                setError(data.message || 'Invalid Admin Credentials');
            }
        } catch (err) {
            setError('Server error, try again later.');
        }
    };

    return (
        <div className="container flex items-center justify-center py-20" style={{ minHeight: '80vh' }}>
            <div className="glass p-8 md:p-12 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden border border-red-500/20">

                <div className="text-center mb-8">
                    <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-3xl font-extrabold mb-2 text-red-600">Admin Portal</h1>
                    <p className="text-muted text-sm">Authorized Personnel Only</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-main">Admin Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 bg-bg-color/50 border-gray-600 focus:border-red-500 w-full rounded p-2"
                                placeholder="admin@domain.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-main">Master Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 bg-bg-color/50 border-gray-600 focus:border-red-500 w-full rounded p-2"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn w-full py-3 mt-4 text-base tracking-wider bg-red-600 hover:bg-red-700 text-white rounded font-bold shadow-lg">
                        Secure Login
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AdminLoginPage;
