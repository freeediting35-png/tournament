import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setAdminToken = useAuthStore(s => s.setAdminToken);
    const addToast = useUIStore(s => s.addToast);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (data.token) {
                setAdminToken(data.token);
                addToast({ type: 'success', message: 'Welcome, Admin! 🔥' });
            } else {
                setError(data.message ?? 'Invalid credentials');
            }
        } catch {
            setError('Server error. Make sure backend is running.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🔥</div>
                    <h1 className="font-display font-bold text-3xl gradient-text">BlazeFire Arena</h1>
                    <p className="text-text-secondary text-sm mt-1 font-mono tracking-widest">ADMIN PANEL</p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="card-glass p-8 space-y-5"
                    style={{ border: '1px solid rgba(255,69,0,0.2)' }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Shield size={20} className="text-primary" />
                        <h2 className="font-display font-bold text-white text-xl">Secure Admin Login</h2>
                    </div>

                    <div>
                        <label className="block text-text-secondary text-sm font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Admin username"
                            className="input-field"
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="block text-text-secondary text-sm font-semibold mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Admin password"
                                className="input-field pr-12"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(s => !s)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-lg p-3">
                            <AlertCircle size={16} className="text-danger shrink-0" />
                            <p className="text-danger text-sm">{error}</p>
                        </div>
                    )}

                    <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                        🔐 LOGIN TO ADMIN PANEL
                    </Button>
                </form>

                <p className="text-center text-text-secondary text-xs mt-4 opacity-60">
                    This page is not publicly accessible. Unauthorized access is prohibited.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
