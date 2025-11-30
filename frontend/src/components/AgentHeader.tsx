import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCompass, FaFileInvoiceDollar, FaHotel, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AgentHeader: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/agent/dashboard', label: 'Dashboard', icon: FaCompass },
        { path: '/agent/quotes', label: 'Quotes', icon: FaFileInvoiceDollar },
        { path: '/partner/inventory', label: 'Inventory', icon: FaHotel },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/agent/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            V
                        </div>
                        <span className="text-xl font-serif font-bold text-white tracking-wide">VoyageGen</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${isActive(item.path)
                                    ? 'text-emerald-400 bg-emerald-500/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={isActive(item.path) ? 'text-emerald-400' : 'text-gray-500'} />
                                {item.label}
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <span className="text-sm font-medium text-gray-300">{user?.name || 'Agent'}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <FaSignOutAlt size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-zinc-900 border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl flex items-center gap-3 text-base font-medium ${isActive(item.path)
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon />
                                    {item.label}
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <div className="flex items-center gap-3 px-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                                        {user?.name?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <FaSignOutAlt />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default AgentHeader;
