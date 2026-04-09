import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { destinations } from '../data/destinations';
import { FaTemperatureHigh, FaClock } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const DestinationGallery: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const { isDark } = useTheme();

    useEffect(() => {
        if (!sectionRef.current || !triggerRef.current) return;

        const totalWidth = sectionRef.current.scrollWidth;
        const windowWidth = window.innerWidth;

        const pin = gsap.to(sectionRef.current, {
            x: () => -(totalWidth - windowWidth),
            ease: "none",
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: () => `+=${totalWidth}`,
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        return () => {
            pin.kill();
        };
    }, []);

    return (
        <section
            ref={triggerRef}
            className="relative overflow-hidden"
            style={{ background: isDark ? '#000000' : 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <div
                className="pointer-events-none absolute left-0 top-0 h-full w-full"
                style={{
                    background: isDark
                        ? 'radial-gradient(ellipse at top, rgba(6, 95, 70, 0.22), rgba(0,0,0,1) 58%)'
                        : 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.08), rgba(243,247,251,1) 62%)'
                }}
            />

            <div ref={sectionRef} className="flex h-screen w-fit items-center gap-20 px-20 will-change-transform">
                <div className="w-[40vw] flex-shrink-0 pl-20">
                    <span className="mb-4 block font-mono text-sm uppercase tracking-widest text-emerald-400">Curated Collection</span>
                    <h2 className="mb-8 text-7xl font-medium leading-tight md:text-8xl" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
                        The World <br />
                        <span
                            className="font-serif italic"
                            style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.5)' }}
                        >
                            Awaits You
                        </span>
                    </h2>
                    <p className="max-w-md text-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Discover destinations that defy imagination. Hand-picked for their beauty, culture, and exclusivity.
                    </p>
                </div>

                {destinations.map((dest, index) => (
                    <div key={dest.id} className="group relative h-[70vh] w-[80vw] flex-shrink-0 md:w-[60vw]">
                        <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                            <div
                                className="absolute inset-0 z-10 transition-colors duration-700"
                                style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(15,23,42,0.3)' }}
                            />
                            <img
                                src={dest.image}
                                alt={dest.name}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";
                                }}
                                className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                style={{ filter: isDark ? 'brightness(0.95)' : 'brightness(0.62) saturate(0.88) contrast(1.05)' }}
                            />
                        </div>

                        <div
                            className="absolute -bottom-10 -left-10 z-20 max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-4"
                            style={{
                                background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(148,163,184,0.22)',
                                color: isDark ? '#ffffff' : '#0f172a'
                            }}
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <span className="text-6xl font-serif" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.35)' }}>
                                    0{index + 1}
                                </span>
                                <div className="flex gap-3">
                                    <span
                                        className="flex items-center gap-1 rounded-full px-2 py-1 text-xs"
                                        style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.06)', color: isDark ? '#86efac' : '#047857' }}
                                    >
                                        <FaTemperatureHigh /> 24C
                                    </span>
                                    <span
                                        className="flex items-center gap-1 rounded-full px-2 py-1 text-xs"
                                        style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.06)', color: isDark ? '#93c5fd' : '#1d4ed8' }}
                                    >
                                        <FaClock /> 5 Days
                                    </span>
                                </div>
                            </div>
                            <h3 className="mb-3 text-4xl font-medium">{dest.name}</h3>
                            <p className="mb-6 line-clamp-2 text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{dest.description}</p>
                            <button
                                className="border-b pb-1 text-sm font-bold uppercase tracking-widest transition-colors"
                                style={{ borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.3)' }}
                            >
                                View Itinerary
                            </button>
                        </div>
                    </div>
                ))}

                <div className="w-[20vw]" />
            </div>
        </section>
    );
};

export default DestinationGallery;
