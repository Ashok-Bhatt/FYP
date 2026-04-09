import { resolveDestinationVisual } from './destinationVisuals';

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
    const destinationName = quote.requirementId?.destination || 'Destination';
    const destinationVisual = resolveDestinationVisual(destinationName);
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
                .container { max-width: 820px; margin: 0 auto; background: #09090b; }
                .header {
                    background:
                        radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 38%),
                        linear-gradient(135deg, #10b981 0%, #0f172a 62%, #020617 100%);
                    color: white;
                    padding: 52px 40px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                .header h1 { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 900; margin-bottom: 10px; }
                .header .subtitle { font-size: 18px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase; }
                .quote-id {
                    background: rgba(0,0,0,0.18);
                    padding: 10px 20px;
                    border-radius: 999px;
                    display: inline-block;
                    margin-top: 20px;
                    font-weight: 600;
                    border: 1px solid rgba(255,255,255,0.08);
                }
                .client-agent-info {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 32px;
                    background: rgba(0,0,0,0.18);
                    padding: 20px;
                    border-radius: 16px;
                    text-align: left;
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255,255,255,0.08);
                }
                .info-block h4 { font-size: 12px; text-transform: uppercase; opacity: 0.72; margin-bottom: 5px; letter-spacing: 0.18em; }
                .info-block p { font-size: 16px; font-weight: 600; }

                .content { padding: 40px; }
                .trip-banner {
                    background:
                        radial-gradient(circle at top left, rgba(255,255,255,0.14), transparent 32%),
                        linear-gradient(135deg, #10b981 0%, #0f172a 58%, #020617 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 24px;
                    margin-bottom: 40px;
                    display: flex;
                    overflow: hidden;
                    min-height: 230px;
                }
                .trip-banner-image { width: 300px; min-height: 230px; }
                .trip-banner img { width: 100%; height: 100%; object-fit: cover; }
                .trip-banner-placeholder {
                    width: 300px;
                    min-height: 230px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 24px;
                    background:
                        radial-gradient(circle at top, rgba(16,185,129,0.34), transparent 40%),
                        linear-gradient(160deg, rgba(15,23,42,0.98), rgba(7,12,23,0.98));
                }
                .trip-placeholder-kicker {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.24em;
                    color: rgba(255,255,255,0.52);
                    margin-bottom: 12px;
                }
                .trip-placeholder-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 30px;
                    line-height: 1.1;
                    font-weight: 700;
                }
                .trip-info {
                    flex: 1;
                    padding: 35px 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .trip-kicker {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.24em;
                    color: rgba(255,255,255,0.62);
                    margin-bottom: 16px;
                }
                .trip-info h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 36px;
                    margin-bottom: 14px;
                    line-height: 1.1;
                }
                .trip-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 10px;
                }
                .trip-chip {
                    padding: 8px 14px;
                    border-radius: 999px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.06);
                    font-size: 12px;
                    font-weight: 600;
                }
                .trip-brief {
                    margin-top: 14px;
                    color: rgba(255,255,255,0.72);
                    font-size: 14px;
                    line-height: 1.6;
                }

                .section { margin: 40px 0; page-break-inside: avoid; }
                .section-title {
                    font-family: 'Playfair Display', serif;
                    color: #10b981;
                    font-size: 24px;
                    border-bottom: 2px solid #10b981;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background: #18181b;
                    border-radius: 16px;
                    overflow: hidden;
                }
                th {
                    background: #27272a;
                    color: #a1a1aa;
                    padding: 16px;
                    text-align: left;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                }
                td { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e4e4e7; }
                .price { color: #10b981; font-weight: 700; }

                .cost-summary { background: #18181b; padding: 30px; border-radius: 18px; margin-top: 30px; }
                .cost-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .total-row {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 14px;
                    margin-top: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .total-row .cost-value { font-size: 28px; font-weight: 700; }

                .footer {
                    background: #000000;
                    color: #a1a1aa;
                    text-align: center;
                    padding: 40px;
                    margin-top: 50px;
                    font-size: 14px;
                }

                @media print {
                    body { -webkit-print-color-adjust: exact; }
                }
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
                            <p>${destinationName}</p>
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
                        ${destinationVisual.imageUrl ? `
                        <div class="trip-banner-image">
                            <img src="${destinationVisual.imageUrl}" alt="${destinationName}" />
                        </div>
                        ` : `
                        <div class="trip-banner-placeholder">
                            <div class="trip-placeholder-kicker">Destination Visual</div>
                            <div class="trip-placeholder-title">${destinationName}</div>
                        </div>
                        `}
                        <div class="trip-info">
                            <div class="trip-kicker">${destinationVisual.source === 'curated' ? 'Curated location image' : 'Destination summary'}</div>
                            <h2>${destinationName} - ${quote.requirementId?.tripType || 'Trip'}</h2>
                            <div class="trip-meta">
                                <span class="trip-chip">${quote.requirementId?.pax?.adults || 0} Adults${quote.requirementId?.pax?.children ? `, ${quote.requirementId?.pax?.children} Children` : ''}</span>
                                <span class="trip-chip">${quote.requirementId?.duration || 0} Days</span>
                                ${destinationVisual.category ? `<span class="trip-chip">${destinationVisual.category}</span>` : ''}
                            </div>
                            ${destinationVisual.brief ? `<div class="trip-brief">${destinationVisual.brief}</div>` : ''}
                        </div>
                    </div>

                    ${quote.sections?.hotels?.length ? `
                    <div class="section">
                        <h3 class="section-title">Accommodation</h3>
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
                                ${quote.sections.hotels.map((hotel) => `
                                    <tr>
                                        <td>${hotel.name}</td>
                                        <td>${hotel.roomType}</td>
                                        <td>${hotel.nights}</td>
                                        <td>Rs ${hotel.unitPrice?.toLocaleString()}</td>
                                        <td class="price">Rs ${hotel.total?.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}

                    ${quote.sections?.transport?.length ? `
                    <div class="section">
                        <h3 class="section-title">Transportation</h3>
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
                                ${quote.sections.transport.map((transport) => `
                                    <tr>
                                        <td>${transport.type}</td>
                                        <td>${transport.days}</td>
                                        <td>Rs ${transport.unitPrice?.toLocaleString()}</td>
                                        <td class="price">Rs ${transport.total?.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}

                    ${quote.sections?.activities?.length ? `
                    <div class="section">
                        <h3 class="section-title">Activities</h3>
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
                                ${quote.sections.activities.map((activity) => `
                                    <tr>
                                        <td>${activity.name}</td>
                                        <td>${activity.qty}</td>
                                        <td>Rs ${activity.unitPrice?.toLocaleString()}</td>
                                        <td class="price">Rs ${activity.total?.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}

                    <div class="cost-summary">
                        <div class="cost-row">
                            <span>Net Cost</span>
                            <span>Rs ${quote.costs?.net?.toLocaleString() || 0}</span>
                        </div>
                        <div class="cost-row">
                            <span>Service Fee</span>
                            <span>Rs ${((quote.costs?.final || 0) - (quote.costs?.net || 0)).toLocaleString()}</span>
                        </div>
                        <div class="total-row">
                            <span style="font-size: 18px; font-weight: 600;">Total Amount</span>
                            <span class="cost-value">Rs ${quote.costs?.final?.toLocaleString() || 0}</span>
                        </div>
                        <div class="cost-row" style="margin-top: 15px; justify-content: center;">
                            <span>Per Person</span>
                            <span style="color: #10b981; font-weight: 600;">Rs ${quote.costs?.perHead?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>VoyageGen quote generated on ${new Date().toLocaleDateString()}</p>
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
