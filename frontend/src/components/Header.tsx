import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPlaneDeparture } from 'react-icons/fa';
import { gsap } from 'gsap';

const Header: React.FC = () => {
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial animation
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
            );
        }
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl"
        >
            <div className="theme-header rounded-full border px-4 py-4 shadow-2xl backdrop-blur-xl md:px-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xl font-bold tracking-tighter cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                        <FaPlaneDeparture className="text-emerald-400" />
                        <span>VoyageGen</span>
                    </div>

                    <nav className="hidden md:flex gap-8 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        <a href="#destinations" className="relative group transition-colors hover:text-emerald-500">
                            Destinations
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-400 transition-all group-hover:w-full" />
                        </a>
                        <a href="#services" className="relative group transition-colors hover:text-emerald-500">
                            Services
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-400 transition-all group-hover:w-full" />
                        </a>
                        <a href="#about" className="relative group transition-colors hover:text-emerald-500">
                            About
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-400 transition-all group-hover:w-full" />
                        </a>
                        <a href="#contact" className="relative group transition-colors hover:text-emerald-500">
                            Contact
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-400 transition-all group-hover:w-full" />
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <button className="hidden sm:block px-5 py-2 text-sm font-medium transition-colors hover:text-emerald-500" style={{ color: 'var(--text-primary)' }}>
                                Login
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className="px-6 py-2 bg-emerald-500 text-white rounded-full text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
