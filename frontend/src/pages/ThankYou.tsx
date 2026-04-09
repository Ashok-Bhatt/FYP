import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPlaneDeparture, FaArrowRight, FaRegClock } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ThankYou: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    const getDashboardPath = () => {
        if (!user) return '/';
        if (user.role === 'AGENT') return '/agent/dashboard';
        if (user.role === 'PARTNER') return '/partner';
        return '/traveler/dashboard';
    };

    const hasPendingTravelerSignup = typeof window !== 'undefined' && Boolean(sessionStorage.getItem('pendingTravelerSignup'));
    const shouldPromptSignup =
        !user &&
        (
            Boolean((location.state as { shouldPromptSignup?: boolean } | null)?.shouldPromptSignup) ||
            hasPendingTravelerSignup
        );

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="max-w-2xl w-full overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_38%),linear-gradient(180deg,rgba(24,24,27,0.96),rgba(10,10,12,0.96))] p-8 md:p-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.42)]"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.18, type: 'spring', stiffness: 180 }}
                    className="mb-6"
                >
                    <FaCheckCircle className="mx-auto text-6xl text-emerald-400" />
                </motion.div>

                <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Trip request received</h1>
                <p className="mx-auto mb-8 max-w-xl text-base text-white/65 md:text-lg">
                    Your journey brief is in. We&apos;ll start matching it with the right partners and quotes will appear as soon as they&apos;re prepared.
                </p>

                {shouldPromptSignup ? (
                    <div className="mb-8 rounded-[28px] border border-emerald-400/15 bg-emerald-400/8 p-6 text-left">
                        <div className="mb-4 flex items-start gap-4">
                            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                                <FaRegClock className="text-xl text-emerald-300" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Create your traveler account next</h2>
                                <p className="mt-2 text-sm leading-6 text-white/65">
                                    This lets you track quote progress, review offers later, and see everything in your traveler dashboard without resubmitting the trip.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/signup?role=USER&source=requirement"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.02]"
                            >
                                Create Traveler Account
                                <FaArrowRight />
                            </Link>
                            <Link
                                to="/login?role=USER"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/10"
                            >
                                I already have an account
                            </Link>
                        </div>
                    </div>
                ) : null}

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        to={getDashboardPath()}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-bold text-white transition-all hover:from-emerald-400 hover:to-emerald-500"
                    >
                        <FaPlaneDeparture />
                        {user ? 'Go to Dashboard' : 'Back to Home'}
                    </Link>
                    {!user ? (
                        <Link
                            to="/plan-journey"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white/70 transition-colors hover:text-white"
                        >
                            Submit another trip
                        </Link>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};

export default ThankYou;
