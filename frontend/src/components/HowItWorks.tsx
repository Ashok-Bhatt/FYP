import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaKeyboard, FaBrain, FaFileInvoiceDollar } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current) return;

        // Animate the connecting line drawing down
        gsap.fromTo(lineRef.current,
            { height: "0%" },
            {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1
                }
            }
        );

        // Animate cards popping in
        cardsRef.current.forEach((card) => {
            if (!card) return;
            gsap.fromTo(card,
                { y: 50, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        
        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, []);

    const steps = [
        {
            title: "Tell Us Your Dream",
            description: "Submit your travel preferences in 60 seconds. Our semantic engine understands plain English requests perfectly.",
            icon: <FaKeyboard className="text-2xl text-emerald-400" />,
            align: "right" // visual alignment
        },
        {
            title: "AI Finds Your Match",
            description: "Our dual-LLM pipeline searches across 40+ luxury partners to find the exact experiences you requested.",
            icon: <FaBrain className="text-2xl text-blue-400" />,
            align: "left"
        },
        {
            title: "Get Quotes Instantly",
            description: "Receive branded, itemized quotes with day-by-day AI itineraries. Export to PDF or share via secure token links.",
            icon: <FaFileInvoiceDollar className="text-2xl text-purple-400" />,
            align: "right"
        }
    ];

    return (
        <section id="how-it-works" ref={sectionRef} className="py-32 relative bg-black">
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">How VoyageGen Works</h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        A seamless, intelligent pipeline from client request to final booked itinerary.
                    </p>
                </div>

                <div className="relative">
                    {/* The animated central line */}
                    <div className="absolute left-12 md:left-1/2 top-0 w-0.5 bg-white/10 h-full -translate-x-1/2">
                        <div ref={lineRef} className="w-full bg-gradient-to-b from-emerald-400 via-blue-500 to-purple-500" />
                    </div>

                    <div className="space-y-24">
                        {steps.map((step, index) => (
                            <div key={index} className={`relative flex items-center ${step.align === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                                
                                {/* Timeline Node */}
                                <div className="absolute left-12 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-black border-2 border-white/20 z-10 shadow-[0_0_20px_rgba(0,0,0,1)]">
                                    <div className="text-white/80 font-black text-sm">0{index + 1}</div>
                                </div>

                                {/* Content Card */}
                                <div className={`ml-24 md:ml-0 md:w-1/2 ${step.align === 'left' ? 'md:pr-20' : 'md:pl-20'}`}>
                                    <div 
                                        ref={el => { cardsRef.current[index] = el; }}
                                        className="glass-panel p-8 rounded-2xl glow-border hover:-translate-y-2 transition-transform duration-500"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                            {step.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                                        <p className="text-white/60 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
