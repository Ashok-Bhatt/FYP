import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCompass, FaFileInvoiceDollar, FaSignOutAlt, FaBars, FaTimes, FaPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TravelerHeader: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/traveler/dashboard', label: 'Dashboard', icon: FaCompass },
        { path: '/traveler/quotes', label: 'My Quotes', icon: FaFileInvoiceDollar },
        { path: '/traveler/plan-journey', label: 'Plan Journey', icon: FaPlane }
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="theme-header sticky top-0 z-50 w-full border-b backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/traveler/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            V
                        </div>
                        <span className="text-xl font-serif font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>VoyageGen</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${isActive(item.path)
                                    ? 'text-blue-500 bg-blue-500/10'
                                    : 'hover:bg-white/5'
                                    }`}
                                style={!isActive(item.path) ? { color: 'var(--text-muted)' } : undefined}
                            >
                                <item.icon className={isActive(item.path) ? 'text-blue-500' : ''} style={!isActive(item.path) ? { color: 'var(--text-muted)' } : undefined} />
                                {item.label}
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-3 rounded-full border px-4 py-2" style={{ background: 'var(--surface-soft)', borderColor: 'var(--border-soft)' }}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                {user?.name?.charAt(0) || 'T'}
                            </div>
                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user?.name || 'Traveler'}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10"
                            title="Logout"
                        >
                            <FaSignOutAlt size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2"
                        style={{ color: 'var(--text-muted)' }}
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
                        className="md:hidden overflow-hidden border-b"
                        style={{ background: 'var(--surface-strong)', borderColor: 'var(--border-soft)' }}
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl flex items-center gap-3 text-base font-medium ${isActive(item.path)
                                        ? 'bg-blue-500/10 text-blue-500'
                                        : 'hover:bg-white/5'
                                        }`}
                                    style={!isActive(item.path) ? { color: 'var(--text-muted)' } : undefined}
                                >
                                    <item.icon />
                                    {item.label}
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-soft)' }}>
                                <div className="flex items-center gap-3 px-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                                        {user?.name?.charAt(0) || 'T'}
                                    </div>
                                    <div>
                                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
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

export default TravelerHeader;
