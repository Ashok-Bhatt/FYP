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
        <div className="min-h-screen bg-black flex">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900 items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2035&auto=format&fit=crop"
                        alt="Travel Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="relative z-10 p-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-3 text-4xl font-bold tracking-tighter text-white mb-6">
                            <FaPlaneDeparture className="text-emerald-400" />
                            <span>VoyageGen</span>
                        </div>
                        <p className="text-xl text-gray-300 max-w-md mx-auto font-serif italic">
                            "Adventure awaits those who dare to explore."
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
                    <div className="absolute top-[40%] -left-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Join VoyageGen and start your journey.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:bg-white/10 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:bg-white/10 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:bg-white/10 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">I am a</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all [&>option]:bg-zinc-900 [&>option]:text-white"
                            >
                                <option value="AGENT" className="bg-zinc-900 text-white">Travel Agent</option>
                                <option value="PARTNER" className="bg-zinc-900 text-white">Travel Partner</option>
                                <option value="USER" className="bg-zinc-900 text-white">Traveler</option>
                            </select>
                        </div>

                        {formData.role === 'PARTNER' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Company Name</label>
                                    <div className="relative group">
                                        <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:bg-white/10 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                            placeholder="ABC Tours & Travels"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-emerald-400 hover:to-emerald-500 transform hover:scale-[1.02] transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        Already have an account? <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">Sign In</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
