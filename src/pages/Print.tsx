import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import logoBase64 from '../assets/logo';

export default function Print() {
    const { state } = useLocation() as any;
    const items = state || [];

    const handlePrint = () => {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pageWidth = 210;
        const marginX = 5;
        const labelWidth = pageWidth - 2 * marginX;
        const labelHeight = 60;
        const spacingY = 10;

        items.forEach((item: any, index: number) => {
            const labelsPerPage = Math.floor((297 - spacingY) / (labelHeight + spacingY));
            const yIndex = index % labelsPerPage;

            if (index % labelsPerPage === 0 && index !== 0) doc.addPage();

            const x = marginX;
            const y = spacingY + yIndex * (labelHeight + spacingY);

            // Borde de etiqueta
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
            doc.text(`Lista: $${item.precioLista}`, x + 5, currentY);
            currentY += 7;

            doc.text(`Contado: $${item.precioContado}`, x + 5, currentY);
            currentY += 7;

            if (item.precioOferta > 0) {
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(200, 0, 0);
                doc.text(`OFERTA: $${item.precioOferta}`, x + 5, currentY);
                doc.setTextColor(0, 0, 0);
            }

            // Logo más grande y centrado
            const logoWidth = 80;
            const logoAspect = 2.5;
            const logoHeight = logoWidth / logoAspect;
            const logoX = x + labelWidth - logoWidth - 5;
            const logoY = y + (labelHeight - logoHeight) / 2;

            doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
        });

        doc.save('etiquetas.pdf');
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>🖨️ Vista de impresión</h2>
            <p>Se generarán {items.length} etiquetas organizadas por página.</p>
            <button onClick={handlePrint}>📄 Generar PDF</button>
        </div>
    );
}