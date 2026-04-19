import React, { useEffect, useRef } from 'react';
import { FaRobot, FaBolt, FaListAlt, FaFilePdf, FaLink, FaExchangeAlt, FaArrowRight } from 'react-icons/fa';
import VanillaTilt from 'vanilla-tilt';

const FeatureBento: React.FC = () => {
    const tiltNodes = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const validNodes = tiltNodes.current.filter((node): node is HTMLDivElement => node !== null);
        VanillaTilt.init(validNodes, {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.1,
            scale: 1.02
        });
        return () => {
            validNodes.forEach(node => {
                if (node && (node as any).vanillaTilt) {
                    (node as any).vanillaTilt.destroy();
                }
            });
        };
    }, []);

    return (
        <section id="features" className="py-32 bg-black text-white relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20 animate-[slideUp_1s_ease-out_forwards]">
                    <span className="text-emerald-400 font-mono text-sm tracking-widest uppercase mb-4 block">The VoyageGen Advantage</span>
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        Everything you need.<br/>
                        <span className="text-white/50 font-light font-serif italic">Nothing you don't.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 h-auto md:h-[900px]">

                    {/* Card 1: AI Search (Large) */}
                    <div 
                        ref={el => { tiltNodes.current[0] = el; }}
                        className="md:col-span-2 md:row-span-2 glass-panel rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group glow-border cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-black/50 border border-white/20 rounded-2xl flex items-center justify-center mb-8 text-emerald-400 text-3xl group-hover:scale-110 transition-transform duration-500">
                                <FaRobot />
                            </div>
                            <h3 className="text-4xl font-black tracking-tight mb-4">Dual-LLM Architecture</h3>
                            <p className="text-white/60 text-xl leading-relaxed max-w-lg">
                                We combine Gemini's unparalleled embedding search with Groq's blindingly fast generative capabilities to craft perfect itineraries in milliseconds.
                            </p>
                        </div>
                        <div className="relative z-10 mt-12">
                            <button className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-emerald-400 group-hover:gap-5 transition-all">
                                Read the Whitepaper <FaArrowRight />
                            </button>
                        </div>
                        
                        {/* Decorative background element */}
                        <div className="absolute right-0 bottom-0 opacity-20 w-1/2 h-1/2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgb3BhY2l0eT0iLjE1Ii8+PC9zdmc+')] [mask-image:radial-gradient(ellipse_at_bottom_right,black_10%,transparent_70%)] transition-transform duration-700 group-hover:scale-110" />
                    </div>

                    {/* Card 2: Instant Quotes */}
                    <div 
                        ref={el => { tiltNodes.current[1] = el; }}
                        className="md:col-span-1 md:row-span-1 glass-panel rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group glow-border cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center mb-6 text-yellow-500 text-xl group-hover:animate-bounce">
                            <FaBolt />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Instant Quoting</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Stop doing math. Generates itemized cost breakdowns with your markup applied automatically.
                        </p>
                    </div>

                    {/* Card 3: Itineraries */}
                    <div 
                        ref={el => { tiltNodes.current[2] = el; }}
                        className="md:col-span-1 md:row-span-1 glass-panel rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group glow-border cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 text-xl group-hover:rotate-12 transition-transform">
                            <FaListAlt />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Day-by-Day Plans</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            AI writes the narrative. It includes hotel details, transport timelines, and daily activities.
                        </p>
                    </div>

                    {/* Card 4: Export to PDF */}
                    <div 
                        ref={el => { tiltNodes.current[3] = el; }}
                        className="md:col-span-1 md:row-span-1 glass-panel rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group glow-border cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-6 text-red-400 text-xl group-hover:scale-110 transition-transform">
                            <FaFilePdf />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">PDF Export</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Download a beautifully branded, client-ready PDF document with a single click.
                        </p>
                    </div>

                    {/* Card 5: Share Links */}
                    <div 
                        ref={el => { tiltNodes.current[4] = el; }}
                        className="md:col-span-1 md:row-span-1 glass-panel rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group glow-border cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 text-xl group-hover:-rotate-12 transition-transform">
                            <FaLink />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Token-Secured Links</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Share live URLs with your clients. They view the quote without ever needing to login.
                        </p>
                    </div>

                    {/* Card 6: Compare (Wide) */}
                    <div 
                        ref={el => { tiltNodes.current[5] = el; }}
                        className="md:col-span-1 md:row-span-1 glass-panel rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group glow-border cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-400 text-xl group-hover:translate-x-2 transition-transform">
                            <FaExchangeAlt />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Multi-Quote Comparison</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Generate multiple variations (e.g., Luxury vs. Standard) and let clients compare easily.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeatureBento;
