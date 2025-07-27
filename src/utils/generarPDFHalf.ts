import jsPDF from 'jspdf';
import logoBase64 from '../assets/logo';

export function generarPDFHalf(items: any[]) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = 210;
    const pageHeight = 297;
    const marginX = 5;
    const spacingX = 5;
    const spacingY = 10;

    const labelWidth = (pageWidth - 3 * marginX) / 2; // dos etiquetas por fila
    const labelHeight = 60;

    const labelsPerRow = 2;
    const rowsPerPage = Math.floor((pageHeight - spacingY) / (labelHeight + spacingY));
    const labelsPerPage = labelsPerRow * rowsPerPage;

    const formatearARS = (valor: number): string => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(valor);
    };

    items.forEach((item, index) => {
        const labelIndex = index % labelsPerPage;
        const row = Math.floor(labelIndex / labelsPerRow);
        const col = labelIndex % labelsPerRow;

        if (labelIndex === 0 && index !== 0) doc.addPage();

        const x = marginX + col * (labelWidth + spacingX);
        const y = spacingY + row * (labelHeight + spacingY);

        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(x, y, labelWidth, labelHeight);

        let currentY = y + 7;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
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

        doc.text(`Contado: ${formatearARS(item.precioContado)}`, x + 5, currentY);
        if (item.precioOferta > 0) {
            const textWidth = doc.getTextWidth(precioListaStr);
            doc.setLineWidth(0.4);
            doc.line(x + 5, currentY - 2, x + 5 + textWidth, currentY - 2); // línea tachada
        }
        currentY += 7;

        if (item.precioOferta > 0) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(200, 0, 0);
            doc.text(`OFERTA CONTADO :`, x + 5, currentY);
            currentY += 7;
            doc.text(`${formatearARS(item.precioOferta)}`, x + 5, currentY);
            doc.setTextColor(0, 0, 0);
        }

        const logoWidth = 40;
        const logoAspect = 2.5;
        const logoHeight = logoWidth / logoAspect;
        const logoX = x + labelWidth - logoWidth - 5;
        const logoY = y + labelHeight - logoHeight - 5;


        doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
    });

    doc.save('etiquetas-medio-ancho.pdf');
}
