interface QuoteSection {
    hotels: Array<{
        name: string;
        city: string;
        roomType: string;
        nights: number;
        unitPrice: number;
        total: number;
    }>;
    transport: Array<{
        type: string;
        days: number;
        unitPrice: number;
        total: number;
    }>;
    activities: Array<{
        name: string;
        unitPrice: number;
        qty: number;
        total: number;
    }>;
}

interface QuoteCosts {
    net: number;
    margin: number;
    final: number;
    perHead: number;
}

interface RequirementData {
    destination: string;
    tripType: string;
    duration: number;
    pax: {
        adults: number;
        children: number;
    };
}

interface PartnerData {
    name: string;
    companyName?: string;
}

interface QuoteData {
    _id: string;
    sections?: QuoteSection;
    costs?: QuoteCosts;
    requirementId?: RequirementData;
    partnerId?: PartnerData;
}

export const generateQuotePDF = (quote: QuoteData) => {
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
            'Australia': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop&q=80',
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
                @media print { body { -webkit-print-color-adjust: exact; } }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>VoyageGen</h1>
                    <div class="subtitle">Travel Quote</div>
                    <div class="quote-id">Quote #${quote._id.slice(-6)}</div>
                    <div class="client-agent-info">
                        <div class="info-block">
                            <h4>Destination</h4>
                            <p>${quote.requirementId?.destination || 'Unknown'}</p>
                        </div>
                        <div class="info-block">
                            <h4>Duration</h4>
                            <p>${quote.requirementId?.duration || 0} Days</p>
                        </div>
                        <div class="info-block">
                            <h4>Travel Partner</h4>
                            <p>${quote.partnerId?.name || quote.partnerId?.companyName || 'Partner'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="content">
                    <div class="trip-banner">
                        <div class="trip-banner-image">
                            <img src="${getDestinationImage(quote.requirementId?.destination || '')}" alt="${quote.requirementId?.destination}" />
                        </div>
                        <div class="trip-info">
                            <h2>${quote.requirementId?.destination} - ${quote.requirementId?.tripType || 'Trip'}</h2>
                            <p>${quote.requirementId?.pax?.adults || 0} Adults${quote.requirementId?.pax?.children > 0 ? `, ${quote.requirementId?.pax?.children} Children` : ''} • ${quote.requirementId?.duration || 0} Days</p>
                        </div>
                    </div>

                    ${quote.sections?.hotels?.length > 0 ? `
                    <div class="section">
                        <h3 class="section-title">🏨 Accommodation</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Hotel</th>
                                    <th>Room Type</th>
                                    <th>Nights</th>
                                    <th>Price/Night</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${quote.sections.hotels.map((hotel: any) => `
                                    <tr>
                                        <td>${hotel.name}</td>
                                        <td>${hotel.roomType}</td>
                                        <td>${hotel.nights}</td>
                                        <td>₹${hotel.unitPrice?.toLocaleString()}</td>
                                        <td class="price">₹${hotel.total?.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}

                    ${quote.sections?.transport?.length > 0 ? `
                    <div class="section">
                        <h3 class="section-title">🚗 Transportation</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Vehicle Type</th>
                                    <th>Days</th>
                                    <th>Price/Day</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${quote.sections.transport.map((transport: any) => `
                                    <tr>
                                        <td>${transport.type}</td>
                                        <td>${transport.days}</td>
                                        <td>₹${transport.unitPrice?.toLocaleString()}</td>
                                        <td class="price">₹${transport.total?.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}

                    ${quote.sections?.activities?.length > 0 ? `
                    <div class="section">
                        <h3 class="section-title">🎯 Activities</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Activity</th>
                                    <th>Quantity</th>
                                    <th>Price/Person</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${quote.sections.activities.map((activity: any) => `
                                    <tr>
                                        <td>${activity.name}</td>
                                        <td>${activity.qty}</td>
                                        <td>₹${activity.unitPrice?.toLocaleString()}</td>
                                        <td class="price">₹${activity.total?.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}

                    <div class="cost-summary">
                        <div class="cost-row">
                            <span>Net Cost</span>
                            <span>₹${quote.costs?.net?.toLocaleString() || 0}</span>
                        </div>
                        <div class="cost-row">
                            <span>Service Fee</span>
                            <span>₹${(quote.costs?.final - quote.costs?.net)?.toLocaleString() || 0}</span>
                        </div>
                        <div class="total-row">
                            <span style="font-size: 18px; font-weight: 600;">TOTAL AMOUNT</span>
                            <span class="cost-value">₹${quote.costs?.final?.toLocaleString() || 0}</span>
                        </div>
                        <div class="cost-row" style="margin-top: 15px; justify-content: center;">
                            <span>Per Person (${quote.requirementId?.pax?.adults || 1} Adults)</span>
                            <span style="color: #10b981; font-weight: 600;">₹${quote.costs?.perHead?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>© 2024 VoyageGen - Your Journey, Perfected</p>
                    <p style="margin-top: 10px;">Generated on ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
};
