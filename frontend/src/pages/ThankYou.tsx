import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPlaneDeparture } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ThankYou: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const getDashboardPath = () => {
        if (!user) return '/';
        if (user.role === 'AGENT') return '/agent/dashboard';
        if (user.role === 'PARTNER') return '/partner';
        return '/traveler/dashboard';
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-6"
                >
                    <FaCheckCircle className="text-emerald-500 text-6xl mx-auto" />
                </motion.div>

                <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
                <p className="text-gray-400 mb-8">
                    Your travel requirement has been submitted successfully. Our team will review it and get back to you soon.
                </p>

                <Link
                    to={getDashboardPath()}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                    <FaPlaneDeparture />
                    Back to Dashboard
                </Link>
            </motion.div>
        </div>
    );
};

export default ThankYou;
