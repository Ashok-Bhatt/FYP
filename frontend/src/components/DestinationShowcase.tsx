import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { destinations } from '../data/destinations';

gsap.registerPlugin(ScrollTrigger);

const DestinationShowcase: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !sliderRef.current) return;

        const cards = gsap.utils.toArray('.destination-card');
        const scrollWidth = sliderRef.current.scrollWidth - window.innerWidth;

        // 1. Horizontal Scroll Animation
        const scrollTween = gsap.to(sliderRef.current, {
            x: -scrollWidth,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1.5, // Super smooth scrub
                end: `+=${scrollWidth}`,
            }
        });

        // 2. The Next-Level Skew Effect (Cards lean when you scroll)
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".destination-card", "skewX", "deg"),
            clamp = gsap.utils.clamp(-20, 20);

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: `+=${scrollWidth}`,
            onUpdate: (self) => {
                const skew = clamp(self.getVelocity() / -300);
                // Only skew if velocity is high enough
                if (Math.abs(skew) > Math.abs(proxy.skew)) {
                    proxy.skew = skew;
                    gsap.to(proxy, {
                        skew: 0,
                        duration: 0.8,
                        ease: "power3",
                        overwrite: true,
                        onUpdate: () => skewSetter(proxy.skew)
                    });
                }
            }
        });

        return () => {
            scrollTween.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="destinations" ref={containerRef} className="h-screen w-full bg-black overflow-hidden relative flex flex-col justify-center perspective-container">
            {/* Header stays pinned */}
            <div className="absolute top-[10%] left-0 w-full px-[5vw] lg:px-[10vw] z-20 pointer-events-none">
                <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    Curated Escapes.
                </h2>
                <p className="text-white/50 text-2xl font-light tracking-wide flex items-center gap-4">
                    <span className="w-16 h-[1px] bg-emerald-500/50 inline-block"></span>
                    From the Swiss Alps to the tea estates of Munnar.
                </p>
            </div>

            {/* Horizontal scrolling track */}
            <div ref={sliderRef} className="flex gap-12 px-[10vw] items-center h-[70vh] mt-24 relative z-10 w-max transform-style-preserve-3d">
                {destinations.map((dest, i) => (
                    <div 
                        key={i} 
                        className="destination-card w-[350px] h-[500px] sm:w-[450px] sm:h-[650px] shrink-0 rounded-[2.5rem] relative group cursor-grab active:cursor-grabbing transform perspective-container border border-white/10 bg-white/5 hover:border-emerald-500/50 transition-colors duration-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] will-change-transform"
                    >
                        {/* Dynamic Glare/Shine Effect */}
                        <div className="absolute inset-0 z-20 rounded-[2.5rem] bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"></div>
                        
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                            <img 
                                src={dest.image} 
                                alt={dest.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-125"
                                loading="lazy"
                            />
                            {/* Deep shadow overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
                        </div>
                        
                        {/* Interactive UI Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-8 z-30 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-[1px] flex-1 bg-emerald-500/50"></div>
                                <span className="text-emerald-400 font-mono text-xs tracking-[0.3em] uppercase">{dest.category || 'Luxury Series'}</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">{dest.name}</h3>
                            <p className="text-white/80 font-light text-lg leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-4 group-hover:translate-y-0">
                                "{dest.brief}"
                            </p>
                        </div>

                        {/* Floating Arrow Badge */}
                        <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 group-hover:rotate-45 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            <span className="text-white text-xl">↗</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Background ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-emerald-900/10 blur-[150px] pointer-events-none rounded-full" />
            
            <style>{`
                .perspective-container { perspective: 2000px; }
                .transform-style-preserve-3d { transform-style: preserve-3d; }
            `}</style>
        </section>
    );
};

export default DestinationShowcase;
