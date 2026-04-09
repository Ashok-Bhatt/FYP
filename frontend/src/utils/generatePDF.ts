import jsPDF from 'jspdf';
import { ItineraryDay } from '../types';
import { resolveDestinationVisual } from './destinationVisuals';

async function fetchImageAsBase64(url: string): Promise<{ data: string; format: 'JPEG' | 'PNG' } | null> {
    try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) return null;

        const blob = await response.blob();
        const format: 'JPEG' | 'PNG' = blob.type.includes('png') ? 'PNG' : 'JPEG';

        return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ data: reader.result as string, format });
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

function drawRoundedBlock(
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: [number, number, number]
) {
    pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    pdf.roundedRect(x, y, width, height, radius, radius, 'F');
}

function writeLabel(pdf: jsPDF, text: string, x: number, y: number, color: [number, number, number], size = 7) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(size);
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.text(text, x, y);
}

const DAY_COLORS: [number, number, number][] = [
    [52, 211, 153],
    [96, 165, 250],
    [167, 139, 250],
    [251, 191, 36],
    [251, 113, 133],
    [45, 212, 191],
    [129, 140, 248],
];

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
    const { destination, duration, tripType, clientName, hotel, finalCost, itinerary } = opts;

    const destinationVisual = resolveDestinationVisual(destination);
    const heroImage = destinationVisual.imageUrl
        ? await fetchImageAsBase64(destinationVisual.imageUrl)
        : null;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    pdf.setFillColor(10, 10, 12);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    pdf.setFillColor(52, 211, 153);
    pdf.rect(0, 0, pageWidth, 4, 'F');

    writeLabel(pdf, 'VOYAGEGEN', margin, 20, [52, 211, 153], 12);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('AI-Powered Travel Planning', margin, 27);

    pdf.setFont('helvetica', 'bold');
    const coverTitleSize = destination.length > 16 ? Math.max(24, 48 - (destination.length - 16) * 2) : 48;
    pdf.setFontSize(coverTitleSize);
    pdf.setTextColor(255, 255, 255);
    pdf.text(destination.toUpperCase(), margin, 72);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.setTextColor(160, 160, 160);
    pdf.text(`${tripType} Journey  |  ${duration} Days`, margin, 85);

    if (heroImage) {
        try {
            pdf.addImage(heroImage.data, heroImage.format, margin, 98, contentWidth, 72, undefined, 'FAST');
        } catch {
            drawRoundedBlock(pdf, margin, 98, contentWidth, 72, 3, [18, 24, 38]);
        }
    } else {
        drawRoundedBlock(pdf, margin, 98, contentWidth, 72, 3, [18, 24, 38]);
        if (destinationVisual.category) {
            writeLabel(pdf, destinationVisual.category.toUpperCase(), margin + 8, 118, [52, 211, 153], 8);
        }
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(24);
        pdf.setTextColor(255, 255, 255);
        pdf.text(destination, margin + 8, 132);
        if (destinationVisual.brief) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);
            pdf.setTextColor(205, 205, 205);
            const lines = pdf.splitTextToSize(destinationVisual.brief, contentWidth - 16);
            pdf.text(lines, margin + 8, 144);
        }
    }

    drawRoundedBlock(pdf, margin, 178, contentWidth, 44, 3, [18, 18, 22]);
    const coverCards = [
        { label: 'Prepared For', value: clientName },
        { label: 'Hotel', value: hotel.length > 30 ? `${hotel.slice(0, 27)}...` : hotel },
        { label: 'Duration', value: `${duration} Days` },
        { label: 'Total Price', value: `INR ${finalCost.toLocaleString('en-IN')}` },
    ];

    coverCards.forEach((card, index) => {
        const x = margin + 10 + (index % 2) * (contentWidth / 2);
        const y = 190 + Math.floor(index / 2) * 18;
        writeLabel(pdf, card.label.toUpperCase(), x, y, [110, 110, 110], 7.5);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(255, 255, 255);
        pdf.text(card.value, x, y + 7);
    });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(60, 60, 65);
    const createdOn = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    pdf.text(`Generated by VoyageGen AI | Llama 4 Scout via Groq | ${createdOn}`, margin, pageHeight - 10);

    itinerary.forEach((day, index) => {
        const color = DAY_COLORS[index % DAY_COLORS.length];
        const headerHeight = 70;
        let cursorY = headerHeight + 20;

        pdf.addPage();
        pdf.setFillColor(12, 12, 15);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.rect(0, 0, pageWidth, 3, 'F');

        if (heroImage) {
            try {
                pdf.addImage(heroImage.data, heroImage.format, 0, 3, pageWidth, headerHeight, undefined, 'FAST');
            } catch {
                pdf.setFillColor(18, 24, 38);
                pdf.rect(0, 3, pageWidth, headerHeight, 'F');
            }
        } else {
            pdf.setFillColor(18, 24, 38);
            pdf.rect(0, 3, pageWidth, headerHeight, 'F');
        }

        pdf.setFillColor(12, 12, 15);
        pdf.rect(0, headerHeight - 12, pageWidth, 15, 'F');

        drawRoundedBlock(pdf, margin, 11, 22, 9, 2, color);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(10, 10, 12);
        pdf.text(`DAY ${day.day}`, margin + 11, 16.5, { align: 'center' });

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(17);
        pdf.setTextColor(255, 255, 255);
        pdf.text(day.title, margin, headerHeight - 3);

        if (destinationVisual.category) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(220, 220, 220);
            pdf.text(`${destination} | ${destinationVisual.category}`, margin, 24);
        }

        if (day.highlight) {
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(8.5);
            pdf.setTextColor(color[0], color[1], color[2]);
            const highlightLines = pdf.splitTextToSize(`"${day.highlight}"`, contentWidth);
            pdf.text(highlightLines, margin, cursorY);
            cursorY += highlightLines.length * 4.6 + 4;
        }

        pdf.setDrawColor(45, 45, 50);
        pdf.setLineWidth(0.25);
        pdf.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 7;

        writeLabel(pdf, 'ACTIVITIES', margin, cursorY, color, 7.5);
        cursorY += 6;

        day.activities.forEach((activity, activityIndex) => {
            if (cursorY > pageHeight - 48) return;

            pdf.setFillColor(color[0], color[1], color[2]);
            pdf.circle(margin + 2.5, cursorY + 1.5, 2.5, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(6.5);
            pdf.setTextColor(10, 10, 12);
            pdf.text(String(activityIndex + 1), margin + 2.5, cursorY + 2.5, { align: 'center' });

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);
            pdf.setTextColor(215, 215, 215);
            const activityLines = pdf.splitTextToSize(activity, contentWidth - 10);
            pdf.text(activityLines, margin + 8, cursorY + 0.5);
            cursorY += activityLines.length * 4.8 + 2.4;
        });

        cursorY += 3;
        pdf.setDrawColor(40, 40, 45);
        pdf.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 7;

        if (day.meals?.length) {
            writeLabel(pdf, 'MEALS', margin, cursorY, [251, 146, 60], 7.5);
            cursorY += 5;

            day.meals.forEach((meal) => {
                if (cursorY > pageHeight - 38) return;
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(8.5);
                pdf.setTextColor(251, 146, 60);
                pdf.text('>', margin, cursorY);

                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(200, 200, 200);
                const mealLines = pdf.splitTextToSize(meal, contentWidth - 6);
                pdf.text(mealLines, margin + 5, cursorY);
                cursorY += mealLines.length * 4.5 + 1.6;
            });

            cursorY += 4;
        }

        if (day.accommodation && cursorY < pageHeight - 36) {
            writeLabel(pdf, 'STAY', margin, cursorY, [251, 191, 36], 7.5);
            cursorY += 5;
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9);
            pdf.setTextColor(255, 255, 255);
            const stayLines = pdf.splitTextToSize(day.accommodation, contentWidth - 4);
            pdf.text(stayLines, margin + 4, cursorY);
            cursorY += stayLines.length * 5 + 5;
        }

        if (day.tips && cursorY < pageHeight - 30) {
            const tipLines = pdf.splitTextToSize(day.tips, contentWidth - 12);
            const boxHeight = 8 + tipLines.length * 4.8 + 5;

            drawRoundedBlock(
                pdf,
                margin,
                cursorY,
                contentWidth,
                boxHeight,
                2,
                [
                    Math.max(18, Math.round(color[0] * 0.16)),
                    Math.max(18, Math.round(color[1] * 0.16)),
                    Math.max(18, Math.round(color[2] * 0.16)),
                ]
            );
            writeLabel(pdf, 'TIP', margin + 4, cursorY + 5.5, color, 7.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8.5);
            pdf.setTextColor(205, 205, 205);
            pdf.text(tipLines, margin + 4, cursorY + 11);
        }

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(55, 55, 60);
        pdf.text(`VoyageGen AI | ${destination}`, margin, pageHeight - 7);
        pdf.text(`${index + 1} / ${itinerary.length}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    });

    pdf.save(`VoyageGen-Itinerary-${destination.replace(/\s+/g, '-')}.pdf`);
}
