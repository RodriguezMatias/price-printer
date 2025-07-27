import jsPDF from 'jspdf';
import logoBase64 from '../assets/logo';
import {formatearARS} from "./currencyFormatter.ts";
import type {Item} from "../types/item.ts";

export function generarPDF(items: Item[]) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = 210;
    const marginX = 5;
    const labelWidth = pageWidth - 2 * marginX;
    const labelHeight = 60;
    const spacingY = 10;

    items.forEach((item, index) => {
        const labelsPerPage = Math.floor((297 - spacingY) / (labelHeight + spacingY));
        const yIndex = index % labelsPerPage;

        if (index % labelsPerPage === 0 && index !== 0) doc.addPage();

        const x = marginX;
        const y = spacingY + yIndex * (labelHeight + spacingY);

        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(x, y, labelWidth, labelHeight);

        let currentY = y + 7;
        doc.setFontSize(10);
        doc.text(`SKU: ${item.sku}`, x + 5, currentY);
        currentY += 7;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(item.nombre, x + 5, currentY);
        currentY += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(item.descripcion || '', x + 5, currentY);
        currentY += 10;

        doc.setFontSize(12);
        const precioListaStr = `Lista: ${formatearARS(item.precioLista)}`;
        doc.text(precioListaStr, x + 5, currentY);
        currentY += 7;

        if (item.precioOferta > 0) {
            doc.text(`Contado: ${formatearARS(item.precioContado)}`, x + 5, currentY);
            const textWidth = doc.getTextWidth(precioListaStr);
            doc.setLineWidth(0.4);
            doc.line(x + 5, currentY - 2, x + 5 + textWidth, currentY - 2); // línea tachada
        }
        currentY += 7;

        if (item.precioOferta > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(200, 0, 0);
            doc.text(`OFERTA CONTADO : ${formatearARS(item.precioOferta)}`, x + 5, currentY);
            doc.setTextColor(0, 0, 0);
        }

        const logoWidth = 80;
        const logoAspect = 2.5;
        const logoHeight = logoWidth / logoAspect;
        const logoX = x + labelWidth - logoWidth - 5;
        const logoY = y + (labelHeight - logoHeight) / 2;

        doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    });

    doc.save('etiquetas.pdf');
}

