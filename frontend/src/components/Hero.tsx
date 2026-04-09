import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
// @ts-ignore
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
    onOpenForm?: () => void;
}

const Hero: React.FC<HeroProps> = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const { isDark } = useTheme();

    useEffect(() => {
        if (!vantaRef.current) return;

        if (vantaEffect) {
            vantaEffect.destroy();
        }

        const effect = CLOUDS({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            skyColor: isDark ? 0x08111f : 0x79c7de,
            cloudColor: 0xffffff,
            cloudShadowColor: isDark ? 0x050816 : 0x5e8aa0,
            sunColor: isDark ? 0x0ea5e9 : 0xffd166,
            sunGlareColor: isDark ? 0x38bdf8 : 0xffb703,
            sunlightColor: isDark ? 0x34d399 : 0xfff3b0,
            speed: isDark ? 0.8 : 1
        });

        setVantaEffect(effect);

        return () => {
            effect.destroy();
        };
    }, [isDark]);

    useEffect(() => {
        const tl = gsap.timeline();

        // Split text animation
        if (textRef.current) {
            const letters = textRef.current.querySelectorAll('.char');
            tl.fromTo(letters,
                { y: 100, opacity: 0, rotateX: -45 },
                {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    stagger: 0.03,
                    duration: 1.2,
                    ease: "power3.out"
                },
                0.5
            );
        }

    }, []);

    const title = "Where smart planning meets unforgettable journeys.";
    const words = title.split(" ");
    const titleClass = isDark ? 'text-white drop-shadow-[0_14px_44px_rgba(0,0,0,0.45)]' : 'text-slate-950 drop-shadow-[0_12px_30px_rgba(255,255,255,0.4)]';
    const subtitleClass = isDark ? 'text-slate-100' : 'text-slate-800';

    return (
        <section ref={heroRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
            <div ref={vantaRef} className="absolute inset-0 z-0" />
            <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'var(--hero-overlay)' }} />
            <div className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center justify-center h-full pt-20">
                <div className="mb-6">
                    <span className="inline-block rounded-full border px-3 py-1 text-xs font-medium tracking-widest uppercase text-emerald-600 mb-6 animate-[fadeIn_1s_ease-out_1s_forwards] opacity-0 shadow-sm backdrop-blur-md" style={{ background: 'var(--surface-soft)', borderColor: 'var(--border-soft)' }}>
                        Redefining Luxury Travel
                    </span>
                </div>

                <div ref={textRef} className="overflow-hidden pb-3 mb-5 max-w-5xl flex flex-wrap justify-center gap-x-3 md:gap-x-6 px-4">
                    {words.map((word, wordIndex) => (
                        <span key={wordIndex} className="inline-block whitespace-nowrap">
                            {word.split('').map((char, charIndex) => (
                                <span key={charIndex} className={`char inline-block font-serif text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight py-1 ${titleClass}`}>{char}</span>
                            ))}
                        </span>
                    ))}
                </div>

                <p className={`max-w-xl mx-auto mb-12 text-lg md:text-xl font-medium opacity-0 animate-[fadeIn_1s_ease-out_1.5s_forwards] leading-relaxed ${subtitleClass}`}>
                    Curated journeys for the modern explorer. <br className="hidden md:block" />
                    Where AI precision meets human wanderlust.
                </p>

                <Link to="/signup">
                    <button className="group relative overflow-hidden rounded-full px-10 py-4 font-serif text-lg font-medium text-white transition-all hover:scale-105 opacity-0 animate-[fadeIn_1s_ease-out_1.8s_forwards] shadow-xl hover:shadow-2xl bg-emerald-500 hover:bg-emerald-600">
                        <span className="relative z-10">Start Your Journey</span>
                    </button>
                </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-[fadeIn_1s_ease-out_2.5s_forwards]">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.72)' }}>Explore</span>
                <div className="w-[1px] h-12" style={{ background: isDark ? 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0))' : 'linear-gradient(to bottom, rgba(15,23,42,0), rgba(15,23,42,0.9), rgba(15,23,42,0))' }} />
            </div>
        </section>
    );
};

export default Hero;
