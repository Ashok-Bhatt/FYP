/**
 * generatePDF.ts  —  Premium VoyageGen Itinerary PDF
 *
 * Skills applied:
 *  - frontend-design  : Luxury Travel Editorial aesthetic, rich hierarchy
 *  - design-spells    : Progress overlay spell during generation
 *  - backend-architect: Parallel enrichment calls, graceful degradation
 *  - pexelsService    : Per-day unique images, canvas cover-crop (no stretch)
 */

import jsPDF from 'jspdf';
import { ItineraryDay } from '../types';
import { fetchAllDayImages, fetchAndCropImage, fetchPexelsImage } from './pexelsService';
import { resolveDestinationVisual } from './destinationVisuals';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PdfOptions {
    destination: string;
    duration: number;
    tripType: string;
    clientName: string;
    hotel: string;
    finalCost: number;
    itinerary: ItineraryDay[];
    pexelsKey?: string;
    apiBaseUrl?: string;
}

interface EnrichResult {
    prose: string;
    foodNote: string;
    culturalTip: string;
}

interface CroppedImage {
    data: string;
    format: 'JPEG';
}

// ─── Design Tokens ───────────────────────────────────────────────────────────

const COLORS = {
    bg:         [10, 10, 13]    as [number, number, number],
    bgCard:     [18, 18, 24]    as [number, number, number],
    bgDeep:     [13, 13, 17]    as [number, number, number],
    white:      [255, 255, 255] as [number, number, number],
    muted:      [140, 140, 150] as [number, number, number],
    dimmed:     [80, 80, 90]    as [number, number, number],
    accent:     [52, 211, 153]  as [number, number, number],   // emerald
    accentDim:  [20, 70, 50]    as [number, number, number],
    gold:       [251, 191, 36]  as [number, number, number],
    orange:     [251, 146, 60]  as [number, number, number],
    rule:       [35, 35, 42]    as [number, number, number],
};

const DAY_ACCENTS: [number, number, number][] = [
    [52, 211, 153],   // emerald
    [96, 165, 250],   // sky
    [167, 139, 250],  // violet
    [251, 191, 36],   // amber
    [251, 113, 133],  // rose
    [45, 212, 191],   // teal
    [129, 140, 248],  // indigo
];

// ─── Progress Overlay (design-spells) ────────────────────────────────────────

function showProgress(message: string, percent: number) {
    let overlay = document.getElementById('pdf-progress-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pdf-progress-overlay';
        overlay.innerHTML = `
            <style>
                #pdf-progress-overlay {
                    position: fixed; inset: 0; z-index: 99999;
                    background: rgba(5,5,8,0.92);
                    backdrop-filter: blur(18px);
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    gap: 24px; font-family: 'Inter', sans-serif;
                }
                #pdf-progress-icon {
                    width: 64px; height: 64px;
                    border: 3px solid rgba(52,211,153,0.2);
                    border-top-color: #34d399;
                    border-radius: 50%;
                    animation: pdf-spin 0.9s linear infinite;
                }
                @keyframes pdf-spin { to { transform: rotate(360deg); } }
                #pdf-progress-title {
                    font-size: 13px; font-weight: 700; letter-spacing: 0.18em;
                    color: #34d399; text-transform: uppercase;
                }
                #pdf-progress-msg {
                    font-size: 15px; color: #e5e5e5; margin-top: -8px;
                }
                #pdf-progress-bar-wrap {
                    width: 280px; height: 4px;
                    background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;
                }
                #pdf-progress-bar {
                    height: 100%; width: 0%;
                    background: linear-gradient(90deg, #34d399, #60a5fa);
                    border-radius: 4px;
                    transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
                }
                #pdf-progress-note {
                    font-size: 12px; color: rgba(255,255,255,0.3);
                }
            </style>
            <div id="pdf-progress-icon"></div>
            <div id="pdf-progress-title">Generating Premium PDF</div>
            <div id="pdf-progress-msg">Initializing...</div>
            <div id="pdf-progress-bar-wrap">
                <div id="pdf-progress-bar"></div>
            </div>
            <div id="pdf-progress-note">Powered by VoyageGen AI</div>
        `;
        document.body.appendChild(overlay);
    }
    const msgEl = document.getElementById('pdf-progress-msg');
    const barEl = document.getElementById('pdf-progress-bar');
    if (msgEl) msgEl.textContent = message;
    if (barEl) barEl.style.width = `${Math.min(100, percent)}%`;
}

function hideProgress() {
    const overlay = document.getElementById('pdf-progress-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.4s ease';
        setTimeout(() => overlay.remove(), 400);
    }
}

// ─── jsPDF Helpers ───────────────────────────────────────────────────────────

function setColor(pdf: jsPDF, color: [number, number, number]) {
    pdf.setTextColor(color[0], color[1], color[2]);
}

function fillColor(pdf: jsPDF, color: [number, number, number]) {
    pdf.setFillColor(color[0], color[1], color[2]);
}

function drawColor(pdf: jsPDF, color: [number, number, number]) {
    pdf.setDrawColor(color[0], color[1], color[2]);
}

function roundedRect(
    pdf: jsPDF,
    x: number, y: number, w: number, h: number,
    r: number,
    color: [number, number, number]
) {
    fillColor(pdf, color);
    pdf.roundedRect(x, y, w, h, r, r, 'F');
}

function rule(pdf: jsPDF, x: number, y: number, w: number) {
    drawColor(pdf, COLORS.rule);
    pdf.setLineWidth(0.25);
    pdf.line(x, y, x + w, y);
}

function label(
    pdf: jsPDF,
    text: string,
    x: number, y: number,
    color: [number, number, number],
    size = 7
) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(size);
    setColor(pdf, color);
    pdf.text(text.toUpperCase(), x, y);
}

function bodyText(
    pdf: jsPDF,
    text: string,
    x: number, y: number,
    maxWidth: number,
    color: [number, number, number] = COLORS.muted,
    size = 8.5
): number {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(size);
    setColor(pdf, color);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * (size * 0.37) + 2;
}

// ─── Enrichment Fetch ─────────────────────────────────────────────────────────

async function fetchEnrichment(
    apiBase: string,
    destination: string,
    day: ItineraryDay
): Promise<EnrichResult> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 9000);
        const res = await fetch(`${apiBase}/api/enrich/day`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destination,
                dayTitle: day.title,
                activities: day.activities,
                highlight: day.highlight,
            }),
            signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) return { prose: '', foodNote: '', culturalTip: '' };
        return await res.json();
    } catch {
        return { prose: '', foodNote: '', culturalTip: '' };
    }
}

// ─── Page Builders ─────────────────────────────────────────────────────────────

const PAGE_W = 210;
const PAGE_H = 297;
const M = 14;           // margin
const CW = PAGE_W - M * 2; // content width

function buildCoverPage(
    pdf: jsPDF,
    opts: PdfOptions,
    heroImg: CroppedImage | null
) {
    fillColor(pdf, COLORS.bg);
    pdf.rect(0, 0, PAGE_W, PAGE_H, 'F');

    // Hero image — 2/3 of page height
    const heroH = 180;
    if (heroImg) {
        try {
            pdf.addImage(heroImg.data, 'JPEG', 0, 0, PAGE_W, heroH);
        } catch {
            fillColor(pdf, [18, 28, 48]);
            pdf.rect(0, 0, PAGE_W, heroH, 'F');
        }
    } else {
        // Gradient stand-in
        fillColor(pdf, [18, 28, 48]);
        pdf.rect(0, 0, PAGE_W, heroH, 'F');
    }

    // Dark overlay gradient over bottom 60% of hero
    for (let i = 0; i < 60; i++) {
        const alpha = i / 60;
        const gray = Math.round(10 * alpha);
        const y = heroH - 60 + i;
        fillColor(pdf, [gray, gray, gray + 3]);
        pdf.setGState(pdf.GState({ opacity: alpha * 0.9 }));
        pdf.rect(0, y, PAGE_W, 1, 'F');
    }
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // VoyageGen branding top-left
    fillColor(pdf, COLORS.accent);
    pdf.roundedRect(M, M, 32, 7, 1, 1, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    setColor(pdf, COLORS.bg);
    pdf.text('VOYAGEGEN', M + 16, M + 4.8, { align: 'center' });

    // Destination title
    const dest = opts.destination.toUpperCase();
    const titleSize = dest.length > 18 ? Math.max(22, 42 - (dest.length - 18) * 1.5) : 42;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(titleSize);
    setColor(pdf, COLORS.white);
    pdf.text(dest, M, heroH - 22);

    // Sub-tagline
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    setColor(pdf, [200, 200, 210]);
    pdf.text(`${opts.tripType} Journey  ·  ${opts.duration} Days`, M, heroH - 10);

    // Info cards area
    const cardsY = heroH + 6;
    roundedRect(pdf, M, cardsY, CW, 54, 3, COLORS.bgCard);

    const cards = [
        { lbl: 'Prepared For', val: opts.clientName },
        { lbl: 'Hotel', val: opts.hotel.length > 28 ? opts.hotel.slice(0, 25) + '…' : opts.hotel },
        { lbl: 'Duration', val: `${opts.duration} Days` },
        { lbl: 'Total Price', val: `₹${opts.finalCost.toLocaleString('en-IN')}` },
    ];

    cards.forEach((card, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = M + 8 + col * (CW / 2);
        const cy = cardsY + 10 + row * 22;

        label(pdf, card.lbl, cx, cy, COLORS.dimmed, 6.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        setColor(pdf, COLORS.white);
        pdf.text(card.val, cx, cy + 8);

        if (col === 0 && row < 2) {
            drawColor(pdf, COLORS.rule);
            pdf.setLineWidth(0.2);
            pdf.line(M + CW / 2, cy - 4, M + CW / 2, cy + 14);
        }
    });

    // Accent rule
    fillColor(pdf, COLORS.accent);
    pdf.rect(M, cardsY, 3, 54, 'F');

    // Footer
    const footerY = PAGE_H - 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    setColor(pdf, COLORS.dimmed);
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    pdf.text(`Generated by VoyageGen AI  ·  Groq Llama 4  ·  ${date}`, M, footerY);
    pdf.text('CONFIDENTIAL', PAGE_W - M, footerY, { align: 'right' });
}

function buildOverviewPage(
    pdf: jsPDF,
    opts: PdfOptions,
    destVisual: ReturnType<typeof resolveDestinationVisual>
) {
    fillColor(pdf, COLORS.bg);
    pdf.rect(0, 0, PAGE_W, PAGE_H, 'F');

    // Top accent bar
    fillColor(pdf, COLORS.accent);
    pdf.rect(0, 0, PAGE_W, 3, 'F');

    let y = 20;

    // Section heading
    label(pdf, 'Trip Overview', M, y, COLORS.accent, 7.5);
    y += 8;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    setColor(pdf, COLORS.white);
    pdf.text('Your Journey at a Glance', M, y);
    y += 12;

    // Destination description
    if (destVisual.brief) {
        const h = bodyText(pdf, destVisual.brief, M, y, CW * 0.62, COLORS.muted, 9);
        y += h + 4;
    }

    y += 2;
    rule(pdf, M, y, CW);
    y += 10;

    // Two-column layout: trip facts | included
    const colW = (CW - 10) / 2;

    // Left: Trip facts
    label(pdf, 'Trip Facts', M, y, COLORS.gold, 7);
    y += 7;

    const facts = [
        ['Destination', opts.destination],
        ['Duration', `${opts.duration} Days`],
        ['Trip Type', opts.tripType],
        ['Travelers', opts.clientName],
        ['Hotel', opts.hotel],
        ['Total Price', `₹${opts.finalCost.toLocaleString('en-IN')}`],
    ];

    facts.forEach(([k, v]) => {
        roundedRect(pdf, M, y, colW, 11, 2, COLORS.bgCard);
        label(pdf, k, M + 4, y + 4.5, COLORS.dimmed, 6.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        setColor(pdf, COLORS.white);
        const shortened = v.length > 28 ? v.slice(0, 25) + '…' : v;
        pdf.text(shortened, M + 4, y + 9);
        y += 14;
    });

    // Right col: what's included
    const rx = M + colW + 10;
    let ry = 44;

    label(pdf, "What's Included", rx, ry, COLORS.accent, 7);
    ry += 7;

    const days = opts.itinerary;
    const hotels = [...new Set(days.map(d => d.accommodation).filter(Boolean))];
    const activities = [...new Set(days.flatMap(d => d.activities))].slice(0, 8);

    roundedRect(pdf, rx, ry, colW, hotels.length * 12 + 16, 2, COLORS.bgCard);
    fillColor(pdf, COLORS.accent);
    pdf.roundedRect(rx, ry, 3, hotels.length * 12 + 16, 1, 1, 'F');
    label(pdf, 'Accommodation', rx + 6, ry + 6, COLORS.muted, 6.5);
    ry += 12;
    hotels.slice(0, 3).forEach(h => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        setColor(pdf, COLORS.white);
        pdf.text(`• ${h}`, rx + 6, ry);
        ry += 10;
    });

    ry += 4;
    roundedRect(pdf, rx, ry, colW, activities.length * 8 + 16, 2, COLORS.bgCard);
    fillColor(pdf, [96, 165, 250]);
    pdf.roundedRect(rx, ry, 3, activities.length * 8 + 16, 1, 1, 'F');
    label(pdf, 'Activities & Sightseeing', rx + 6, ry + 6, COLORS.muted, 6.5);
    ry += 12;
    activities.forEach(a => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        setColor(pdf, [200, 200, 215]);
        const short = a.length > 40 ? a.slice(0, 37) + '…' : a;
        pdf.text(`• ${short}`, rx + 6, ry);
        ry += 8;
    });

    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    setColor(pdf, COLORS.dimmed);
    pdf.text(`VoyageGen AI  ·  ${opts.destination}`, M, PAGE_H - 7);
    pdf.text('Overview', PAGE_W - M, PAGE_H - 7, { align: 'right' });
}

function buildDayPage(
    pdf: jsPDF,
    day: ItineraryDay,
    index: number,
    total: number,
    destination: string,
    dayImg: CroppedImage | null,
    enrich: EnrichResult
) {
    const color = DAY_ACCENTS[index % DAY_ACCENTS.length];
    const IMG_H = 78;

    fillColor(pdf, COLORS.bgDeep);
    pdf.rect(0, 0, PAGE_W, PAGE_H, 'F');

    // Day image — full width, cover-cropped
    if (dayImg) {
        try {
            pdf.addImage(dayImg.data, 'JPEG', 0, 0, PAGE_W, IMG_H);
        } catch {
            fillColor(pdf, COLORS.bgCard);
            pdf.rect(0, 0, PAGE_W, IMG_H, 'F');
        }
    } else {
        fillColor(pdf, COLORS.bgCard);
        pdf.rect(0, 0, PAGE_W, IMG_H, 'F');
        // Subtle color tint
        fillColor(pdf, color);
        pdf.setGState(pdf.GState({ opacity: 0.15 }));
        pdf.rect(0, 0, PAGE_W, IMG_H, 'F');
        pdf.setGState(pdf.GState({ opacity: 1 }));
    }

    // Dark gradient over bottom 40px of image
    for (let i = 0; i < 40; i++) {
        const alpha = i / 40;
        const c = Math.round(13 * alpha);
        fillColor(pdf, [c, c, c + 4]);
        pdf.setGState(pdf.GState({ opacity: alpha }));
        pdf.rect(0, IMG_H - 40 + i, PAGE_W, 1, 'F');
    }
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Color accent bar at top of image
    fillColor(pdf, color);
    pdf.rect(0, 0, PAGE_W, 3, 'F');

    // Day badge
    roundedRect(pdf, M, 9, 28, 9, 2, color);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    setColor(pdf, COLORS.bg);
    pdf.text(`DAY ${day.day}`, M + 14, 14.8, { align: 'center' });

    // Day title on image
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    setColor(pdf, COLORS.white);
    pdf.text(day.title, M, IMG_H - 12);

    // Destination breadcrumb
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    setColor(pdf, [210, 210, 220]);
    pdf.text(destination, M, IMG_H - 4);

    // Content area
    let y = IMG_H + 10;

    // Highlight quote
    if (day.highlight) {
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(9);
        setColor(pdf, color);
        const hLines = pdf.splitTextToSize(`"${day.highlight}"`, CW);
        pdf.text(hLines, M, y);
        y += hLines.length * 4.8 + 4;
    }

    // Groq Prose
    if (enrich.prose) {
        const h = bodyText(pdf, enrich.prose, M, y, CW, [185, 185, 200], 8.5);
        y += h + 5;
    }

    rule(pdf, M, y, CW);
    y += 8;

    // ── Activities ──────────────────────────────────────────────────────────
    label(pdf, 'Activities', M, y, color, 7.5);
    y += 7;

    day.activities.forEach((act, ai) => {
        if (y > PAGE_H - 52) return;

        // Numbered circle
        fillColor(pdf, color);
        pdf.circle(M + 3, y + 1.5, 3, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6.5);
        setColor(pdf, COLORS.bg);
        pdf.text(String(ai + 1), M + 3, y + 2.7, { align: 'center' });

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        setColor(pdf, COLORS.white);
        const actLines = pdf.splitTextToSize(act, CW - 10);
        pdf.text(actLines, M + 9, y + 0.5);
        y += actLines.length * 4.8 + 3.5;
    });

    y += 3;
    rule(pdf, M, y, CW);
    y += 7;

    // ── Meals ───────────────────────────────────────────────────────────────
    if (day.meals?.length && y < PAGE_H - 48) {
        label(pdf, 'Meals', M, y, COLORS.orange, 7.5);
        y += 6;

        day.meals.forEach(meal => {
            if (y > PAGE_H - 42) return;
            roundedRect(pdf, M, y, CW, 12, 2, COLORS.bgCard);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(7);
            setColor(pdf, COLORS.orange);
            pdf.text('›', M + 4, y + 7.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            setColor(pdf, [210, 210, 215]);
            const mLines = pdf.splitTextToSize(meal, CW - 14);
            pdf.text(mLines[0] || meal, M + 9, y + 7.5);
            y += 14;
        });

        // Groq food note
        if (enrich.foodNote && y < PAGE_H - 36) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(7.5);
            setColor(pdf, COLORS.dimmed);
            pdf.text(`💡 ${enrich.foodNote}`, M, y);
            y += 9;
        }

        y += 2;
    }

    // ── Stay ────────────────────────────────────────────────────────────────
    if (day.accommodation && y < PAGE_H - 36) {
        rule(pdf, M, y, CW);
        y += 7;

        label(pdf, 'Stay', M, y, COLORS.gold, 7.5);
        y += 6;

        roundedRect(pdf, M, y, CW, 14, 2, COLORS.bgCard);
        fillColor(pdf, COLORS.gold);
        pdf.roundedRect(M, y, 2.5, 14, 1, 1, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        setColor(pdf, COLORS.white);
        const stayLines = pdf.splitTextToSize(day.accommodation, CW - 10);
        pdf.text(stayLines[0], M + 6, y + 8.5);
        y += 17;
    }

    // ── Pro Tip ─────────────────────────────────────────────────────────────
    const tipText = enrich.culturalTip || day.tips;
    if (tipText && y < PAGE_H - 28) {
        const tipLines = pdf.splitTextToSize(tipText, CW - 14);
        const boxH = tipLines.length * 4.8 + 14;

        const tipBg: [number, number, number] = [
            Math.max(14, Math.round(color[0] * 0.13)),
            Math.max(14, Math.round(color[1] * 0.13)),
            Math.max(14, Math.round(color[2] * 0.13)),
        ];
        roundedRect(pdf, M, y, CW, boxH, 3, tipBg);
        fillColor(pdf, color);
        pdf.roundedRect(M, y, 3, boxH, 1, 1, 'F');

        label(pdf, '✦  Pro Tip', M + 6, y + 6, color, 7);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        setColor(pdf, [200, 200, 210]);
        pdf.text(tipLines, M + 6, y + 12);
    }

    // ── Footer ──────────────────────────────────────────────────────────────
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    setColor(pdf, COLORS.dimmed);
    pdf.text(`VoyageGen  ·  ${destination}`, M, PAGE_H - 6);
    pdf.text(`${index + 1} / ${total}`, PAGE_W - M, PAGE_H - 6, { align: 'right' });
}

function buildClosingPage(pdf: jsPDF, destination: string) {
    fillColor(pdf, COLORS.bg);
    pdf.rect(0, 0, PAGE_W, PAGE_H, 'F');

    // Accent bars
    fillColor(pdf, COLORS.accent);
    pdf.rect(0, 0, PAGE_W, 3, 'F');
    pdf.rect(0, PAGE_H - 3, PAGE_W, 3, 'F');

    const cx = PAGE_W / 2;
    let y = 100;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    setColor(pdf, COLORS.white);
    pdf.text('Bon Voyage!', cx, y, { align: 'center' });
    y += 12;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    setColor(pdf, COLORS.muted);
    pdf.text(`Thank you for trusting VoyageGen with your journey to ${destination}.`, cx, y, { align: 'center' });
    y += 8;
    pdf.text('We hope every moment exceeds your expectations.', cx, y, { align: 'center' });
    y += 20;

    rule(pdf, M + 30, y, CW - 60);
    y += 14;

    label(pdf, 'Powered by', cx - 20, y, COLORS.dimmed, 7);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    setColor(pdf, COLORS.accent);
    pdf.text('VoyageGen AI  ·  Groq Llama 4', cx, y + 8, { align: 'center' });
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function generateItineraryPDF(opts: PdfOptions): Promise<void> {
    const {
        destination, duration, tripType, clientName,
        hotel, finalCost, itinerary, pexelsKey,
    } = opts;

    const apiBase = opts.apiBaseUrl || (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
    const totalSteps = itinerary.length + 3; // images + enrich + pages
    let step = 0;

    const advance = (msg: string) => {
        step++;
        showProgress(msg, (step / totalSteps) * 100);
    };

    try {
        // ── Step 1: Fetch all images in parallel ─────────────────────────────
        advance('Fetching destination visuals…');
        const destVisual = resolveDestinationVisual(destination);

        let heroImg: CroppedImage | null = null;
        let dayImageMap: Record<number, string | null> = {};

        if (pexelsKey) {
            const heroUrl = await fetchPexelsImage(`${destination} landscape travel`, pexelsKey, 0);
            const allDayUrls = await fetchAllDayImages(itinerary, destination, pexelsKey);

            advance('Cropping images for premium layout…');

            const [croppedHero, ...croppedDays] = await Promise.allSettled([
                heroUrl ? fetchAndCropImage(heroUrl, 1860, 800) : Promise.resolve(null),
                ...Object.values(allDayUrls).map(url =>
                    url ? fetchAndCropImage(url, 1860, 720) : Promise.resolve(null)
                ),
            ]);

            heroImg = croppedHero.status === 'fulfilled' ? croppedHero.value : null;
            croppedDays.forEach((r, i) => {
                dayImageMap[i] = r.status === 'fulfilled' && r.value ? r.value.data : null;
            });
        } else {
            advance('Loading destination visuals…');
        }

        // ── Step 2: Enrich all days in parallel ──────────────────────────────
        advance('Generating AI prose for each day…');
        showProgress(`Enriching ${itinerary.length} days with AI narrative…`, (step / totalSteps) * 100);

        const enrichments = await Promise.allSettled(
            itinerary.map(day => fetchEnrichment(apiBase, destination, day))
        );
        const dayEnrich: EnrichResult[] = enrichments.map(r =>
            r.status === 'fulfilled' ? r.value : { prose: '', foodNote: '', culturalTip: '' }
        );

        // ── Step 3: Build PDF ─────────────────────────────────────────────────
        advance('Building premium PDF layout…');

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        // Cover
        buildCoverPage(pdf, { destination, duration, tripType, clientName, hotel, finalCost, itinerary }, heroImg);

        // Trip overview
        pdf.addPage();
        buildOverviewPage(pdf, { destination, duration, tripType, clientName, hotel, finalCost, itinerary }, destVisual);

        // Day pages
        itinerary.forEach((day, i) => {
            advance(`Composing Day ${i + 1} of ${itinerary.length}…`);
            pdf.addPage();
            const img = dayImageMap[i]
                ? { data: dayImageMap[i] as string, format: 'JPEG' as const }
                : null;
            buildDayPage(pdf, day, i, itinerary.length, destination, img, dayEnrich[i]);
        });

        // Closing page
        pdf.addPage();
        buildClosingPage(pdf, destination);

        // ── Save ─────────────────────────────────────────────────────────────
        showProgress('Saving your PDF…', 98);
        await new Promise(r => setTimeout(r, 300)); // Let progress render
        pdf.save(`VoyageGen-Itinerary-${destination.replace(/[\s,]+/g, '-')}.pdf`);

    } finally {
        setTimeout(hideProgress, 600);
    }
}
