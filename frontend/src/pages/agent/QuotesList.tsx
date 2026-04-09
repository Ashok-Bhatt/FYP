import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import QuoteFilters from '../../components/agent/QuoteFilters';
import QuoteCard from '../../components/agent/QuoteCard';
import EmptyState from '../../components/agent/EmptyState';
import LoadingState from '../../components/agent/LoadingState';

const QuotesList: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [shareDropdown, setShareDropdown] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Helper functions for view data
    const getViewStatusColor = (lastViewedAt: string | null) => {
        if (!lastViewedAt) return 'red';
        
        const now = new Date();
        const lastViewed = new Date(lastViewedAt);
        const hoursDiff = (now.getTime() - lastViewed.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 1) return 'green';
        if (hoursDiff < 24) return 'amber';
        return 'red';
    };

    const getViewStatusClasses = (status: string) => {
        switch (status) {
            case 'green': return { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' };
            case 'amber': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' };
            case 'red': return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' };
            default: return { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/30' };
        }
    };

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/quotes`, config);
                
                // Ensure we have an array
                const quotesData = Array.isArray(res.data) ? res.data : [];
                setQuotes(quotesData);
                setFilteredQuotes(quotesData);
            } catch (error) {
                console.error('Error fetching quotes:', error);
                // Set empty arrays on error
                setQuotes([]);
                setFilteredQuotes([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchQuotes();
        }
    }, [user]);

    useEffect(() => {
        let result = Array.isArray(quotes) ? quotes : [];

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

    // Helper function to fetch quotes (reuse from above)
    const fetchQuotes = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/quotes`, config);
            
            const quotesData = Array.isArray(res.data) ? res.data : [];
            setQuotes(quotesData);
            setFilteredQuotes(quotesData);
        } catch (error) {
            console.error('Error fetching quotes:', error);
            setQuotes([]);
            setFilteredQuotes([]);
        }
    };

    // Setup SSE connection for real-time updates
    useEffect(() => {
        if (!user?.token) return;

        const eventSource = new EventSource(
            `${import.meta.env.VITE_API_URL}/api/quotes/stream/views`
        );

        eventSource.onopen = () => {
            console.log('SSE connection opened');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'quote_viewed') {
                    // Refresh quotes when a view event is received
                    fetchQuotes();
                    
                    // Show toast notification
                    toast.success('Your quote was just viewed!', {
                        icon: '👁️',
                        duration: 4000,
                        position: 'top-right',
                    });
                }
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
        };

        return () => {
            eventSource.close();
        };
    }, [user?.token, fetchQuotes]);

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
        if (!window.confirm('Are you sure you want to delete this quote?')) return;

        const config = {
            headers: { Authorization: `Bearer ${user?.token}` }
        };

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/quotes/${quoteId}`, config);
            setQuotes(prev => prev.filter(q => q._id !== quoteId));
            setFilteredQuotes(prev => prev.filter(q => q._id !== quoteId));
        } catch (error) {
            console.error('Error deleting quote:', error);
        }
    };

    if (loading) return <LoadingState />;

    return (
        <div className="page-shell min-h-screen font-sans selection:bg-emerald-500 selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-[var(--text-primary)] to-slate-500 bg-clip-text text-transparent mb-2">
                            Generated Quotes
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage and share your travel quotations</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <QuoteFilters
                            searchTerm={searchTerm}
                            filterStatus={filterStatus}
                            onSearchChange={setSearchTerm}
                            onFilterChange={setFilterStatus}
                        />
                    </div>
                </div>

                <div className="mt-8">
                {filteredQuotes.length === 0 ? (
                    <EmptyState onNavigateToDashboard={() => navigate('/agent/dashboard')} />
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredQuotes.map(quote => (
                            <QuoteCard
                                key={quote._id}
                                quote={quote}
                                shareDropdown={shareDropdown}
                                setShareDropdown={setShareDropdown}
                                onView={(id) => navigate(`/agent/quote/${id}`)}
                                onDownload={downloadPDF}
                                onDelete={deleteQuote}
                                onShare={handleShare}
                                getViewStatusColor={getViewStatusColor}
                                getViewStatusClasses={getViewStatusClasses}
                            />
                        ))}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

export default QuotesList;
