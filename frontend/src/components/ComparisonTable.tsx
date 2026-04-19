import React from 'react';
import { FaCheck, FaTimes, FaMinus } from 'react-icons/fa';

const ComparisonTable: React.FC = () => {
    const features = [
        {
            name: "Semantic Vector Search",
            voyage: true,
            traditional: false,
            ota: false,
            chatgpt: false,
            desc: "Understands nuanced vibes instead of absolute keywords."
        },
        {
            name: "Live Supplier Pricing",
            voyage: true,
            traditional: true,
            ota: true,
            chatgpt: false,
            desc: "Pulls exact availability and accurate markup costs."
        },
        {
            name: "Instant Day-by-Day Generation",
            voyage: true,
            traditional: false,
            ota: false,
            chatgpt: true,
            desc: "AI writes the full narrative of the trip."
        },
        {
            name: "Export to Client-Ready PDF",
            voyage: true,
            traditional: false,
            ota: false,
            chatgpt: false,
            desc: "1-Click beautifully branded proposal generation."
        },
        {
            name: "Time to Build Itinerary",
            voyage: "45 Seconds",
            traditional: "4-12 Hours",
            ota: "N/A (Self-Serve)",
            chatgpt: "20+ Minutes (Prompting)",
            desc: "Average time from request to final quote."
        },
        {
            name: "Pricing",
            voyage: "100% Free",
            traditional: "High Overhead",
            ota: "Hidden Fees",
            chatgpt: "$20/mo",
            desc: "What it costs to operate."
        }
    ];

    const renderIcon = (value: boolean | string) => {
        if (value === 'partial') return <FaMinus className="text-yellow-500/80 text-xl" />;
        if (typeof value === 'string') {
            return <span className="font-bold text-white tracking-wide">{value}</span>;
        }
        if (value === true) return <FaCheck className="text-emerald-400 text-xl drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />;
        return <FaTimes className="text-white/20 text-xl font-light" />;
    };

    return (
        <section id="comparison" className="py-32 bg-black relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-900/10 blur-[120px] pointer-events-none rounded-[100%]" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <span className="text-emerald-400 font-mono text-sm tracking-widest uppercase mb-4 block">The Unfair Advantage</span>
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Why We Wipe The Floor <br /> <span className="text-white/40 italic font-serif">With The Competition.</span>
                    </h2>
                </div>

                <div className="glass-panel p-2 md:p-8 rounded-[2rem] glow-border overflow-hidden relative">
                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr>
                                    <th className="p-6 text-white/50 font-medium font-mono text-sm uppercase tracking-wider w-[25%] border-b border-white/10">Feature</th>
                                    
                                    <th className="p-6 text-center border-b border-white/10 relative w-[20%]">
                                        <div className="absolute inset-0 bg-emerald-500/10 rounded-t-2xl border-t border-l border-r border-emerald-500/30" />
                                        <div className="relative z-10 inline-block px-5 py-2 bg-emerald-500/20 text-emerald-400 rounded-full font-black text-sm tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                            VOYAGEGEN
                                        </div>
                                    </th>
                                    
                                    <th className="p-6 font-bold text-white/70 text-center border-b border-white/10 w-[18%]">Traditional Agent</th>
                                    <th className="p-6 font-bold text-white/70 text-center border-b border-white/10 w-[18%]">Typical OTAs</th>
                                    <th className="p-6 font-bold text-white/70 text-center border-b border-white/10 w-[18%]">Generic ChatGPT</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {features.map((item, idx) => (
                                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6">
                                            <div className="font-bold text-white text-lg tracking-tight">{item.name}</div>
                                            <div className="text-sm text-white/40 mt-1 leading-relaxed pr-4">{item.desc}</div>
                                        </td>
                                        
                                        <td className="p-6 text-center relative">
                                            <div className="absolute inset-y-0 inset-x-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 border-l border-r border-emerald-500/20 transition-colors" />
                                            {idx === features.length - 1 && (
                                                <div className="absolute inset-x-0 bottom-0 h-px bg-emerald-500/30" />
                                            )}
                                            <div className="flex justify-center relative z-10">{renderIcon(item.voyage)}</div>
                                        </td>
                                        
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center">{renderIcon(item.traditional)}</div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center">{renderIcon(item.ota)}</div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center">{renderIcon(item.chatgpt)}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.6);
                }
            `}</style>
        </section>
    );
};

export default ComparisonTable;
