import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaFileInvoice, FaEye, FaDownload, FaSpinner, FaTrash, FaShare, FaEnvelope, FaWhatsapp, FaInstagram, FaSearch, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AgentHeader from '../../components/AgentHeader';

const QuotesList: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [shareDropdown, setShareDropdown] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/quotes`, config);
                setQuotes(res.data);
                setFilteredQuotes(res.data);
            } catch (error) {
                console.error('Error fetching quotes:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchQuotes();
        }
    }, [user]);

    useEffect(() => {
        let result = quotes;

        if (searchTerm) {
            result = result.filter(q =>
                q.requirementId?.contactInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.requirementId?.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q._id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'ALL') {
            result = result.filter(q => q.status === filterStatus);
        }

        setFilteredQuotes(result);
    }, [searchTerm, filterStatus, quotes]);

    const downloadPDF = (quote: any) => {
        const getDestinationImage = (destination: string) => {
            const imageMap: { [key: string]: string } = {
                'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop&q=80',
                'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=400&fit=crop&q=80',
                'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop&q=80',
                'Maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=400&fit=crop&q=80',
                'Switzerland': 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&h=400&fit=crop&q=80',
                'Italy': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=400&fit=crop&q=80',
                'Greece': 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=400&fit=crop&q=80',
                'Thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=400&fit=crop&q=80',
                'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=400&fit=crop&q=80',
                'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=400&fit=crop&q=80',
                'Japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=400&fit=crop&q=80',
                'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=400&fit=crop&q=80',
                'Australia': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&h=400&fit=crop&q=80',
                'Turkey': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=400&fit=crop&q=80',
                'Spain': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&h=400&fit=crop&q=80',
                'Egypt': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&h=400&fit=crop&q=80',
                'India': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop&q=80',
                'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=400&fit=crop&q=80',
                'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=400&fit=crop&q=80',
                'Rajasthan': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=400&fit=crop&q=80',
                'Kashmir': 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&h=400&fit=crop&q=80',
                'Himachal': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=400&fit=crop&q=80',
                'Uttarakhand': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=400&fit=crop&q=80',
            };
            const dest = destination || '';
            for (const [key, value] of Object.entries(imageMap)) {
                if (dest.toLowerCase().includes(key.toLowerCase())) return value;
            }
            return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&q=80';
        };

        const printWindow = window.open('', '', 'height=900,width=800');
        if (!printWindow) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>VoyageGen Quote #${quote._id.slice(-6)}</title>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Inter', sans-serif; color: #ffffff; background: #000000; }
                    .container { max-width: 800px; margin: 0 auto; background: #09090b; }
                    .header { 
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white; padding: 50px 40px; text-align: center; position: relative; overflow: hidden;
                    }
                    .header h1 { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 900; margin-bottom: 10px; }
                    .header .subtitle { font-size: 18px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase; }
                    .quote-id { 
                        background: rgba(0,0,0,0.2); padding: 10px 20px; border-radius: 50px; 
                        display: inline-block; margin-top: 20px; font-weight: 600; 
                    }
                    .client-agent-info {
                        display: flex; justify-content: space-between; margin-top: 30px;
                        background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px;
                        text-align: left; backdrop-filter: blur(5px);
                    }
                    .info-block h4 { font-size: 12px; text-transform: uppercase; opacity: 0.8; margin-bottom: 5px; }
                    .info-block p { font-size: 16px; font-weight: 600; }
                    
                    .content { padding: 40px; }
                    .trip-banner { 
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        border-radius: 20px; margin-bottom: 40px; display: flex; overflow: hidden;
                    }
                    .trip-banner-image { width: 280px; height: 200px; }
                    .trip-banner img { width: 100%; height: 100%; object-fit: cover; }
                    .trip-info { flex: 1; padding: 35px 40px; display: flex; flex-direction: column; justify-content: center; }
                    .trip-info h2 { font-family: 'Playfair Display', serif; font-size: 36px; margin-bottom: 15px; }
                    
                    .section { margin: 40px 0; page-break-inside: avoid; }
                    .section-title { 
                        font-family: 'Playfair Display', serif; color: #10b981; font-size: 24px; 
                        border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 20px;
                    }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #18181b; border-radius: 12px; overflow: hidden; }
                    th { background: #27272a; color: #a1a1aa; padding: 16px; text-align: left; font-size: 12px; text-transform: uppercase; }
                    td { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e4e4e7; }
                    .price { color: #10b981; font-weight: 700; }
                    
                    .cost-summary { background: #18181b; padding: 30px; border-radius: 15px; margin-top: 30px; }
                    .cost-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
                    .total-row { 
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white; padding: 20px; border-radius: 12px; margin-top: 15px;
                        display: flex; justify-content: space-between; align-items: center;
                    }
                    .total-row .cost-value { font-size: 28px; font-weight: 700; }
                    
                    .footer { background: #000000; color: #a1a1aa; text-align: center; padding: 40px; margin-top: 50px; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>VoyageGen</h1>
                        <div class="subtitle">Premium Travel Quotation</div>
                        <div class="quote-id">Quote #${quote._id.slice(-6)}</div>
                        
                        <div class="client-agent-info">
                            <div class="info-block">
                                <h4>Prepared For</h4>
                                <p>${quote.requirementId?.contactInfo?.name || 'Valued Traveler'}</p>
                            </div>
                            <div class="info-block" style="text-align: right;">
                                <h4>Travel Agent</h4>
                                <p>${user?.name || 'VoyageGen Agent'}</p>
                            </div>
                        </div>
                    </div>

                    <div class="content">
                        <div class="trip-banner">
                            ${quote.requirementId?.destination ? `
                                <div class="trip-banner-image">
                                    <img src="${getDestinationImage(quote.requirementId.destination)}" alt="Destination">
                                </div>
                            ` : ''}
                            <div class="trip-info">
                                <h2>${quote.requirementId?.destination || 'Dream Destination'}</h2>
                                <div style="display: flex; gap: 15px; font-size: 14px;">
                                    <span>🗓️ ${quote.requirementId?.duration || 'N/A'} Days</span>
                                    <span>✈️ ${quote.requirementId?.tripType || 'Adventure'}</span>
                                </div>
                            </div>
                        </div>

                        ${quote.sections?.hotels?.length > 0 ? `
                        <div class="section">
                            <h2 class="section-title">Accommodation</h2>
                            <table>
                                <tr><th>Hotel</th><th>City</th><th>Nights</th><th>Total</th></tr>
                                ${quote.sections.hotels.map((h: any) => `
                                <tr>
                                    <td>${h.name}</td><td>${h.city}</td><td>${h.nights}</td>
                                    <td class="price">₹${h.total?.toLocaleString()}</td>
                                </tr>`).join('')}
                            </table>
                        </div>` : ''}

                        ${quote.sections?.transport?.length > 0 ? `
                        <div class="section">
                            <h2 class="section-title">Transportation</h2>
                            <table>
                                <tr><th>Type</th><th>Days</th><th>Total</th></tr>
                                ${quote.sections.transport.map((t: any) => `
                                <tr>
                                    <td>${t.type}</td><td>${t.days}</td>
                                    <td class="price">₹${t.total?.toLocaleString()}</td>
                                </tr>`).join('')}
                            </table>
                        </div>` : ''}

                        ${quote.sections?.activities?.length > 0 ? `
                        <div class="section">
                            <h2 class="section-title">Activities</h2>
                            <table>
                                <tr><th>Activity</th><th>Qty</th><th>Total</th></tr>
                                ${quote.sections.activities.map((a: any) => `
                                <tr>
                                    <td>${a.name}</td><td>${a.qty}</td>
                                    <td class="price">₹${a.total?.toLocaleString()}</td>
                                </tr>`).join('')}
                            </table>
                        </div>` : ''}

                        <div class="section">
                            <h2 class="section-title">Cost Breakdown</h2>
                            <div class="cost-summary">
                                <div class="cost-row"><span>Base Cost</span><span>₹${quote.costs?.net?.toLocaleString()}</span></div>
                                <div class="cost-row"><span>Service Fees</span><span>₹${((quote.costs?.final - quote.costs?.net) || 0).toLocaleString()}</span></div>
                                <div class="total-row">
                                    <span>Total Package Price</span>
                                    <span class="cost-value">₹${quote.costs?.final?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for choosing VoyageGen!</p>
                        <p>Generated on ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    const handleShare = (quote: any, method: string) => {
        const quoteUrl = `${window.location.origin}/agent/quote/${quote._id}`;
        const destination = quote.requirementId?.destination || 'Dream Destination';
        const price = quote.costs?.final?.toLocaleString() || '0';
        const message = `Check out this travel quote for ${destination}! Price: ₹${price}. Details: ${quoteUrl}`;

        if (method === 'email') window.open(`mailto:?subject=Travel Quote&body=${encodeURIComponent(message)}`);
        if (method === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        if (method === 'instagram') {
            navigator.clipboard.writeText(message);
            alert('Copied to clipboard!');
        }
        setShareDropdown(null);
    };

    const deleteQuote = async (quoteId: string) => {
        if (!window.confirm('Delete this quote?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/quotes/${quoteId}`, config);
            setQuotes(prev => prev.filter(q => q._id !== quoteId));
            setFilteredQuotes(prev => prev.filter(q => q._id !== quoteId));
        } catch (error) {
            console.error('Error deleting quote:', error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-emerald-400" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500 selection:text-white">
            <AgentHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                            Generated Quotes
                        </h1>
                        <p className="text-gray-400">Manage and share your travel quotations</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search quotes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 bg-zinc-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full sm:w-48 bg-zinc-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                            >
                                <option value="ALL">All Status</option>
                                <option value="DRAFT">Draft</option>
                                <option value="READY">Ready</option>
                                <option value="SENT_TO_USER">Sent</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="DECLINED">Declined</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredQuotes.length === 0 ? (
                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-16 text-center">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaFileInvoice className="text-4xl text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No Quotes Found</h3>
                        <p className="text-gray-400 mb-8">Try adjusting your search or generate a new quote.</p>
                        <button
                            onClick={() => navigate('/agent/dashboard')}
                            className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredQuotes.map(quote => (
                            <motion.div
                                key={quote._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group"
                            >
                                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                {quote.requirementId?.contactInfo?.name || 'Traveler'}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                quote.status === 'DRAFT' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' :
                                                quote.status === 'READY' ? 'border-orange-500/30 text-orange-500 bg-orange-500/10' :
                                                quote.status === 'SENT_TO_USER' ? 'border-blue-500/30 text-blue-500 bg-blue-500/10' :
                                                quote.status === 'ACCEPTED' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' :
                                                quote.status === 'DECLINED' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                                                'border-gray-500/30 text-gray-500 bg-gray-500/10'
                                            }`}>
                                                {quote.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                            <span className="font-mono text-xs bg-white/5 px-2 py-1 rounded">#{quote._id.slice(-6)}</span>
                                            <span>•</span>
                                            <span>{quote.requirementId?.destination || 'N/A'}</span>
                                            <span>•</span>
                                            <span>{quote.requirementId?.duration || 0} Days</span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                            <p className="text-lg font-bold text-emerald-400">₹{quote.costs?.final?.toLocaleString() || '0'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hotels</p>
                                            <p className="text-lg font-bold">{quote.sections?.hotels?.length || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Activities</p>
                                            <p className="text-lg font-bold">{quote.sections?.activities?.length || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transport</p>
                                            <p className="text-lg font-bold">{quote.sections?.transport?.length || 0}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                                        <button
                                            onClick={() => navigate(`/agent/quote/${quote._id}`)}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                                            title="Edit Quote"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => downloadPDF(quote)}
                                            className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                            title="Download PDF"
                                        >
                                            <FaDownload />
                                        </button>

                                        <div className="relative">
                                            <button
                                                onClick={() => setShareDropdown(shareDropdown === quote._id ? null : quote._id)}
                                                className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                                title="Share"
                                            >
                                                <FaShare />
                                            </button>
                                            {shareDropdown === quote._id && (
                                                <div className="absolute right-0 top-full mt-2 bg-zinc-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-10 min-w-[160px]">
                                                    <button onClick={() => handleShare(quote, 'email')} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-sm text-left"><FaEnvelope /> Email</button>
                                                    <button onClick={() => handleShare(quote, 'whatsapp')} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-sm text-left"><FaWhatsapp /> WhatsApp</button>
                                                    <button onClick={() => handleShare(quote, 'instagram')} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 text-sm text-left"><FaInstagram /> Instagram</button>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => deleteQuote(quote._id)}
                                            className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotesList;
