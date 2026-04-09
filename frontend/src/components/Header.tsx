import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPlaneDeparture, FaBars, FaTimes } from 'react-icons/fa';
import { gsap } from 'gsap';

const Header: React.FC = () => {
    const headerRef = useRef<HTMLHeadingElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Initial entrance animation
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 }
            );
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                ref={headerRef}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-4 ${
                    scrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
                }`}
            >
                {/* Aurora Subtle Glow Behind Header when Scrolled */}
                {scrolled && (
                    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-emerald-500/10 blur-[100px]" />
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter cursor-pointer text-white drop-shadow-md z-50">
                        <FaPlaneDeparture className="text-emerald-400" />
                        <span>Voyage<span className="text-white/70 font-light">Gen</span></span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex gap-10 text-sm font-medium text-white/80">
                        <a href="#how-it-works" className="hover:text-emerald-400 transition-colors relative group">
                            How It Works
                            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                        </a>
                        <a href="#features" className="hover:text-emerald-400 transition-colors relative group">
                            Features
                            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                        </a>
                        <a href="#comparison" className="hover:text-emerald-400 transition-colors relative group">
                            Compare
                            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                        </a>
                        <a href="#destinations" className="hover:text-emerald-400 transition-colors relative group">
                            Destinations
                            <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                        </a>
                    </nav>

                    {/* CTAs */}
                    <div className="hidden lg:flex items-center gap-4 z-50">
                        <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link to="/plan-journey" className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            Plan Your Trip
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="lg:hidden text-white/90 z-50 hover:text-emerald-400 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 lg:hidden transition-opacity duration-300 flex flex-col justify-center items-center gap-8 ${
                mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-white/80 hover:text-emerald-400">How It Works</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-white/80 hover:text-emerald-400">Features</a>
                <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-white/80 hover:text-emerald-400">Compare</a>
                <a href="#destinations" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-white/80 hover:text-emerald-400">Destinations</a>
                
                <div className="flex flex-col gap-4 mt-8 w-64">
                    <Link to="/plan-journey" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-white text-black text-center rounded-full font-bold">
                        Plan Your Trip
                    </Link>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-center rounded-full font-bold">
                        Login
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Header;
