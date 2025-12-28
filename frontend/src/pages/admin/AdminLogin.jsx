import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { adminAPI } from '../../lib/api';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAdmin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await adminAPI.login(email, password);

            if (response.success) {
                login(response.admin, response.token);
                toast.success('Login successful!');
                navigate('/admin');
            } else {
                toast.error(response.message || 'Login failed');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="admin-logo-container">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3 text-gradient">Admin Portal</h1>
                    <p className="text-gray-400 text-lg">Secure access to dashboard</p>
                </div>

                {/* Login Form */}
                <div className="admin-login-card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="admin-form-group">
                            <label htmlFor="email" className="admin-form-label">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="admin-form-input"
                                    placeholder="admin@example.com"
                                />
                                <Mail className="admin-form-icon h-5 w-5" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="admin-form-group">
                            <label htmlFor="password" className="admin-form-label">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="admin-form-input"
                                    placeholder="••••••••"
                                />
                                <Lock className="admin-form-icon h-5 w-5" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="admin-password-toggle"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="admin-submit-btn"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <div className="admin-loading-spinner"></div>
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Access Dashboard
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <a href="/" className="admin-back-link">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
