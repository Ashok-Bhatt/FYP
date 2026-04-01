import jsPDF from 'jspdf';
import { ItineraryDay } from '../types';

// ── Image helpers ─────────────────────────────────────────────────────────────

async function fetchImageAsBase64(url: string): Promise<{ data: string; format: 'JPEG' | 'PNG' } | null> {
    try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) return null;
        const blob = await res.blob();
        const format: 'JPEG' | 'PNG' = blob.type.includes('png') ? 'PNG' : 'JPEG';
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ data: reader.result as string, format });
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

async function fetchPexelsUrl(query: string, pexelsKey: string): Promise<string | null> {
    if (!pexelsKey) return null;
    try {
        const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&size=large`,
            { headers: { Authorization: pexelsKey } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const photos: { src: { large: string } }[] = data.photos || [];
        if (!photos.length) return null;
        const pick = Math.abs(query.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)) % photos.length;
        return photos[pick].src.large;
    } catch {
        return null;
    }
}

async function getImage(url: string, fallbackSeed: number): Promise<{ data: string; format: 'JPEG' | 'PNG' } | null> {
    if (url) {
        const img = await fetchImageAsBase64(url);
        if (img) return img;
    }
    // Picsum fallback — always works, no watermarks
    return fetchImageAsBase64(`https://picsum.photos/seed/${(fallbackSeed * 37 + 99) % 900}/1200/500`);
}

// ── Color palette (R, G, B) per day ───────────────────────────────────────────
const PALETTE: [number, number, number][] = [
    [52,  211, 153],  // emerald
    [96,  165, 250],  // blue
    [167, 139, 250],  // purple
    [251, 191,  36],  // amber
    [251, 113, 133],  // rose
    [45,  212, 191],  // teal
    [129, 140, 248],  // indigo
];

// ── Drawing helpers ──────────────────────────────────────────────────────────

function drawRoundRect(pdf: jsPDF, x: number, y: number, w: number, h: number, r: number, fillR: number, fillG: number, fillB: number) {
    pdf.setFillColor(fillR, fillG, fillB);
    pdf.roundedRect(x, y, w, h, r, r, 'F');
}

function label(pdf: jsPDF, text: string, x: number, y: number, r: number, g: number, b: number, size = 7) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(size);
    pdf.setTextColor(r, g, b);
    pdf.text(text, x, y);
}

function body(pdf: jsPDF, text: string, x: number, y: number, size = 9) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(size);
    pdf.setTextColor(210, 210, 210);
    pdf.text(text, x, y);
}

function multilineBody(pdf: jsPDF, text: string, x: number, y: number, maxW: number, size = 8.5): number {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(size);
    pdf.setTextColor(200, 200, 200);
    const lines: string[] = pdf.splitTextToSize(text, maxW);
    pdf.text(lines, x, y);
    return lines.length;
}

// ── Main export ───────────────────────────────────────────────────────────────

export interface PdfOptions {
    destination: string;
    duration: number;
    tripType: string;
    clientName: string;
    hotel: string;
    finalCost: number;
    itinerary: ItineraryDay[];
    pexelsKey?: string;
}

export async function generateItineraryPDF(opts: PdfOptions): Promise<void> {
    const { destination, duration, tripType, clientName, hotel, finalCost, itinerary, pexelsKey = '' } = opts;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const H = 297;
    const M = 14; // margin
    const CW = W - M * 2; // content width

    // ════════════════════════════════════════════════════════
    // PAGE 1 — COVER
    // ════════════════════════════════════════════════════════
    pdf.setFillColor(10, 10, 12);
    pdf.rect(0, 0, W, H, 'F');

    // Top accent strip
    pdf.setFillColor(52, 211, 153);
    pdf.rect(0, 0, W, 4, 'F');

    // VoyageGen wordmark
    label(pdf, 'VOYAGEGEN', M, 20, 52, 211, 153, 12);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('AI-Powered Travel Planning', M, 27);

    // Large destination
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(48);
    pdf.setTextColor(255, 255, 255);
    // Fit long destination names
    const destFontSize = destination.length > 14 ? Math.max(24, 48 - (destination.length - 14) * 2) : 48;
    pdf.setFontSize(destFontSize);
    pdf.text(destination.toUpperCase(), M, 95);

    // Trip type tagline
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.setTextColor(160, 160, 160);
    pdf.text(`${tripType} Journey  |  ${duration} Days`, M, 110);

    // Divider
    pdf.setDrawColor(52, 211, 153);
    pdf.setLineWidth(0.4);
    pdf.line(M, 120, W - M, 120);

    // Info cards — 2x2 grid, NO EMOJI, plain ASCII bullets
    const cards = [
        { lbl: 'PREPARED FOR', val: clientName },
        { lbl: 'HOTEL', val: hotel.length > 28 ? hotel.substring(0, 25) + '...' : hotel },
        { lbl: 'DURATION', val: `${duration} Days` },
        { lbl: 'TOTAL PRICE', val: `INR ${finalCost.toLocaleString('en-IN')}` },
    ];

    cards.forEach(({ lbl, val }, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = M + col * (CW / 2);
        const cy = 132 + row * 26;

        label(pdf, lbl, cx, cy, 110, 110, 110, 7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(255, 255, 255);
        pdf.text(val, cx, cy + 8);
    });

    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(50, 50, 50);
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    pdf.text(`Generated by VoyageGen AI  |  Llama 4 Scout via Groq  |  ${today}`, M, H - 10);

    // ════════════════════════════════════════════════════════
    // PRE-FETCH ALL IMAGES (parallel, destination-focused queries)
    // ════════════════════════════════════════════════════════
    const imageData = await Promise.all(
        itinerary.map(async (day, idx) => {
            // Use destination + day title as primary query — much more relevant than activity keywords
            const query = `${destination} ${day.title.replace(/day \d+[:\-]?\s*/i, '').trim()}`;

            let pexelsUrl: string | null = null;
            if (pexelsKey) pexelsUrl = await fetchPexelsUrl(query, pexelsKey);

            return getImage(pexelsUrl || '', idx);
        })
    );

    // ════════════════════════════════════════════════════════
    // PAGES 2+ — ONE DAY PER PAGE
    // ════════════════════════════════════════════════════════
    for (let i = 0; i < itinerary.length; i++) {
        const day = itinerary[i];
        const [r, g, b] = PALETTE[i % PALETTE.length];
        const img = imageData[i];

        pdf.addPage();

        // Dark page background
        pdf.setFillColor(12, 12, 15);
        pdf.rect(0, 0, W, H, 'F');

        // Color accent strip
        pdf.setFillColor(r, g, b);
        pdf.rect(0, 0, W, 3, 'F');

        // ── Hero image ───────────────────────────────────────
        const IMG_H = 68;
        if (img) {
            try {
                pdf.addImage(img.data, img.format, 0, 3, W, IMG_H, undefined, 'FAST');
            } catch { /* skip on error */ }
        }

        // Dark gradient overlay at the bottom of the image
        // Simulate gradient with 3 increasingly opaque rects
        const gSteps = 5;
        for (let s = 0; s < gSteps; s++) {
            const alpha = Math.round((s / gSteps) * 200);
            pdf.setFillColor(12, 12, 15);
            // We can't set opacity easily in jsPDF without GState, so just use solid at bottom
            if (s === gSteps - 1) {
                pdf.rect(0, 3 + IMG_H - 18, W, 18, 'F');
            }
        }

        // Day badge pill
        drawRoundRect(pdf, M, 10, 20, 9, 2, r, g, b);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(10, 10, 12);
        pdf.text(`DAY ${day.day}`, M + 10, 15.5, { align: 'center' });

        // Title text over image
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(255, 255, 255);
        pdf.text(day.title, M, 3 + IMG_H - 6);

        let Y = 3 + IMG_H + 7;

        // Highlight / subheadline
        if (day.highlight) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(8.5);
            pdf.setTextColor(r, g, b);
            const hLines: string[] = pdf.splitTextToSize(`"${day.highlight}"`, CW);
            pdf.text(hLines, M, Y);
            Y += hLines.length * 4.5 + 3;
        }

        // Thin rule
        pdf.setDrawColor(45, 45, 50);
        pdf.setLineWidth(0.25);
        pdf.line(M, Y, W - M, Y);
        Y += 6;

        // ── ACTIVITIES ───────────────────────────────────────
        label(pdf, 'ACTIVITIES', M, Y, r, g, b, 7.5);
        Y += 5.5;

        day.activities.forEach((act, ai) => {
            if (Y > H - 45) return; // guard against overflow

            // Number circle
            pdf.setFillColor(r, g, b);
            pdf.circle(M + 2.5, Y + 1.5, 2.5, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(6.5);
            pdf.setTextColor(10, 10, 12);
            pdf.text(String(ai + 1), M + 2.5, Y + 2.5, { align: 'center' });

            // Activity text — indent past the circle
            const actLines: string[] = pdf.splitTextToSize(act, CW - 10);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);
            pdf.setTextColor(215, 215, 215);
            pdf.text(actLines, M + 8, Y + 0.5);
            Y += actLines.length * 4.8 + 2.5;
        });

        Y += 3;
        pdf.setDrawColor(40, 40, 45);
        pdf.line(M, Y, W - M, Y);
        Y += 7;

        // ── MEALS (full width, stacked) ──────────────────────
        if (day.meals && day.meals.length > 0) {
            label(pdf, 'MEALS', M, Y, 251, 146, 60, 7.5);
            Y += 5;

            day.meals.forEach(meal => {
                if (Y > H - 35) return;
                // ">" bullet instead of emoji
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(8.5);
                pdf.setTextColor(251, 146, 60);
                pdf.text('>', M, Y);
                const mLines: string[] = pdf.splitTextToSize(meal, CW - 6);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(200, 200, 200);
                pdf.text(mLines, M + 5, Y);
                Y += mLines.length * 4.5 + 1.5;
            });
            Y += 3;
        }

        // ── STAY ─────────────────────────────────────────────
        if (day.accommodation && Y < H - 30) {
            label(pdf, 'STAY', M, Y, 251, 191, 36, 7.5);
            Y += 5;
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9);
            pdf.setTextColor(255, 255, 255);
            const stayLines: string[] = pdf.splitTextToSize(day.accommodation, CW - 4);
            pdf.text(stayLines, M + 4, Y);
            Y += stayLines.length * 5 + 4;
        }

        // ── PRO TIP box ───────────────────────────────────────
        if (day.tips && Y < H - 25) {
            const tipLines: string[] = pdf.splitTextToSize(day.tips, CW - 12);
            const boxH = 8 + tipLines.length * 4.8 + 5;

            // Background box
            drawRoundRect(pdf, M, Y, CW, boxH, 2,
                Math.round(r * 0.15), Math.round(g * 0.15), Math.round(b * 0.15));

            // "TIP" label — no emoji
            label(pdf, 'TIP', M + 4, Y + 5.5, r, g, b, 7.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);
            pdf.setTextColor(200, 200, 200);
            pdf.text(tipLines, M + 4, Y + 11);
        }

        // ── Page footer ───────────────────────────────────────
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(55, 55, 60);
        pdf.text(`VoyageGen AI  |  ${destination}`, M, H - 7);
        pdf.text(`${i + 1} / ${itinerary.length}`, W - M, H - 7, { align: 'right' });
    }

    pdf.save(`VoyageGen-Itinerary-${destination.replace(/\s+/g, '-')}.pdf`);
}
