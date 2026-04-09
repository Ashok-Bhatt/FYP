import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlaneDeparture, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'AGENT') navigate('/agent');
            else if (user.role === 'PARTNER') navigate('/partner');
            else navigate('/traveler/dashboard');
        } catch (err) {
            setError(err as string);
        }
    };

    return (
        <div className="page-shell relative flex min-h-screen overflow-hidden">
            <div className="relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2" style={{ background: 'var(--surface-strong)' }}>
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
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
                            "The journey of a thousand miles begins with a single step."
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
                        <h2 className="mb-2 text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Enter your details to access your account.</p>
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
                            <label className="ml-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                            <div className="group relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-emerald-400" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="theme-input w-full rounded-xl py-4 pl-12 pr-4 transition-all"
                                    placeholder="........"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:from-emerald-400 hover:to-emerald-500"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center" style={{ color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/signup" className="font-medium text-emerald-500 transition-colors hover:text-emerald-400">Create Account</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
