import jsPDF from 'jspdf';
import logoBase64 from '../assets/logo';
import { formatearARS } from './currencyFormatter.ts';
import type { Item } from '../types/item.ts';

export function generarPDF(items: Item[]) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = 210;
    const marginX = 10;
    const labelWidth = pageWidth - 2 * marginX;
    const labelHeight = 60;
    const spacingY = 10;

    items.forEach((item, index) => {
        const labelsPerPage = Math.floor((297 - spacingY) / (labelHeight + spacingY));
        const yIndex = index % labelsPerPage;

        if (index % labelsPerPage === 0 && index !== 0) doc.addPage();

        const x = marginX;
        const y = spacingY + yIndex * (labelHeight + spacingY);

        // Marco visual
        doc.setDrawColor(200);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, labelWidth, labelHeight, 3, 3, 'S');

        let currentY = y + 10;

        // SKU
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`SKU: ${item.sku}`, x + 6, currentY);
        currentY += 6;

        // Nombre (multilínea si es necesario)
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        const nombre = doc.splitTextToSize(item.nombre.toUpperCase(), labelWidth - 12);
        doc.text(nombre, x + 6, currentY);
        currentY += nombre.length * 5 + 2;

        // Descripción (multilínea sin italic)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        const descripcion = doc.splitTextToSize(item.descripcion || '', labelWidth - 12);
        doc.text(descripcion, x + 6, currentY);
        currentY += descripcion.length * 5 + 2;

        // Precios
        const precioListaStr = `Lista: ${formatearARS(item.precioLista)}`;
        const precioContadoStr = `Contado: ${formatearARS(item.precioContado)}`;
        const ofertaStr = `OFERTA: ${formatearARS(item.precioOferta)}`;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80);
        doc.text(precioListaStr, x + 6, currentY);

        // Línea tachada si hay oferta
        if (item.precioOferta > 0) {
            const textWidth = doc.getTextWidth(precioListaStr);
            doc.setLineWidth(0.4);
            doc.setDrawColor(150, 0, 0);
            doc.line(x + 6, currentY + 6, x + 6 + textWidth, currentY + 6);
        }

        currentY += 7;

        // Contado
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        doc.text(precioContadoStr, x + 6, currentY);
        currentY += 7;

        // Oferta (si existe)
        if (item.precioOferta > 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(200, 0, 0);
            doc.text(ofertaStr, x + 6, currentY);
            doc.setTextColor(0, 0, 0);
        }

        // Logo
        const logoWidth = 80;
        const logoAspect = 2.5;
        const logoHeight = logoWidth / logoAspect;
        const logoX = x + labelWidth - logoWidth - 6;
        const logoY = y + labelHeight - logoHeight - 15;

        doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const nombreArchivo = `ancho-completo_${items.length}u_${timestamp}.pdf`;

    doc.save(nombreArchivo);
}
