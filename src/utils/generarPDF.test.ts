import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generarPDF } from './generarPDF';
import jsPDF from 'jspdf';

vi.mock('jspdf', () => {
    const mockInstance = {
        setDrawColor: vi.fn(),
        setLineWidth: vi.fn(),
        roundedRect: vi.fn(),
        setFontSize: vi.fn(),
        setFont: vi.fn(),
        setTextColor: vi.fn(),
        text: vi.fn(),
        getTextWidth: vi.fn().mockReturnValue(50),
        line: vi.fn(),
        addImage: vi.fn(),
        splitTextToSize: vi.fn((text) => [text]),
        addPage: vi.fn(),
        save: vi.fn()
    };
    return { default: vi.fn(() => mockInstance) };
});

vi.mock('./assets/logo', () => 'mocked-logo-base64');
vi.mock('./currencyFormatter', () => ({
    formatearARS: (value: number) => `$${value.toFixed(2)}`
}));

describe('generarPDF', () => {
    const mockItems = [
        {
            sku: '123',
            nombre: 'Silla de madera',
            descripcion: 'Silla robusta de madera natural',
            precioLista: 10000,
            precioContado: 9000,
            precioOferta: 8000,
        },
        {
            sku: '456',
            nombre: 'Mesa comedor',
            descripcion: 'Mesa de 6 personas extensible',
            precioLista: 30000,
            precioContado: 28000,
            precioOferta: 0,
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería crear un PDF con los elementos', () => {
        generarPDF(mockItems);
        const PDF = (jsPDF as any).mock.results[0].value;

        expect(PDF.roundedRect).toHaveBeenCalled();
        expect(PDF.text).toHaveBeenCalledWith(expect.stringContaining('SKU: 123'), expect.any(Number), expect.any(Number));
        expect(PDF.text).toHaveBeenCalledWith(expect.arrayContaining(['SILLA DE MADERA']), expect.any(Number), expect.any(Number));
        expect(PDF.text).toHaveBeenCalledWith(expect.stringContaining('OFERTA: $8000.00'), expect.any(Number), expect.any(Number));
        expect(PDF.addImage).toHaveBeenCalled();
        expect(PDF.save).toHaveBeenCalled();
    });

    it('no debería dibujar línea tachada si no hay oferta', () => {
        generarPDF([mockItems[1]]);
        const PDF = (jsPDF as any).mock.results[0].value;
        expect(PDF.line).not.toHaveBeenCalled();
    });
});