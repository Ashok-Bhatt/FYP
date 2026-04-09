import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlaneDeparture, FaUser, FaEnvelope, FaLock, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'AGENT' as 'AGENT' | 'PARTNER' | 'USER',
        companyName: '',
        destinations: [] as string[],
    });
    const [error, setError] = useState<string>('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            const user = await register(formData);
            if (user.role === 'AGENT') navigate('/agent');
            else if (user.role === 'PARTNER') navigate('/partner');
            else navigate('/traveler/plan-journey');
        } catch (err) {
            setError(err as string);
        }
    };

    return (
        <div className="page-shell relative flex min-h-screen overflow-hidden">
            <div className="relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2" style={{ background: 'var(--surface-strong)' }}>
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2035&auto=format&fit=crop"
                        alt="Travel Background"
                        className="h-full w-full object-cover opacity-55"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                </div>

                <div className="relative z-10 p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-6 flex items-center justify-center gap-3 text-4xl font-bold tracking-tighter text-white">
                            <FaPlaneDeparture className="text-emerald-400" />
                            <span>VoyageGen</span>
                        </div>
                        <p className="mx-auto max-w-md font-serif text-xl italic text-gray-200">
                            "Adventure awaits those who dare to explore."
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="relative flex w-full items-center justify-center p-8 lg:w-1/2">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden">
                    <div className="absolute -right-[10%] -top-[20%] h-[500px] w-[500px] rounded-full bg-emerald-500/12 blur-[100px]" />
                    <div className="absolute -left-[10%] top-[40%] h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-[80px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="theme-surface-strong z-10 w-full max-w-md rounded-[2rem] p-8 md:p-10"
                >
                    <div className="mb-10">
                        <h2 className="mb-2 text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Join VoyageGen and start your journey.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 flex items-center gap-2 rounded-xl p-4 text-sm"
                            style={{
                                background: 'var(--danger-soft)',
                                border: '1px solid color-mix(in srgb, var(--danger-text) 24%, transparent)',
                                color: 'var(--danger-text)'
                            }}
                        >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--danger-text)' }} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="ml-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                            <div className="group relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-400" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="theme-input w-full rounded-xl py-4 pl-12 pr-4 transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="ml-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                            <div className="group relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-400" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="theme-input w-full rounded-xl py-4 pl-12 pr-4 transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="ml-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Password</label>
                            <div className="group relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-400" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="theme-input w-full rounded-xl py-4 pl-12 pr-4 transition-all"
                                    placeholder="........"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="ml-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>I am a</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="theme-input w-full rounded-xl py-4 px-4 transition-all"
                            >
                                <option value="AGENT">Travel Agent</option>
                                <option value="PARTNER">Travel Partner</option>
                                <option value="USER">Traveler</option>
                            </select>
                        </div>

                        {formData.role === 'PARTNER' && (
                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Company Name</label>
                                <div className="group relative">
                                    <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-400" style={{ color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="theme-input w-full rounded-xl py-4 pl-12 pr-4 transition-all"
                                        placeholder="ABC Tours & Travels"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:from-emerald-400 hover:to-emerald-500"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center" style={{ color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" className="font-medium text-emerald-500 transition-colors hover:text-emerald-400">Sign In</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
