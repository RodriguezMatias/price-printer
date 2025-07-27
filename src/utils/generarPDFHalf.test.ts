import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generarPDFHalf } from './generarPDFHalf';
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

describe('generarPDFHalf', () => {
    const mockItems = [
        {
            sku: '789',
            nombre: 'Sillón relax',
            descripcion: 'Sillón reclinable con apoyabrazos',
            precioLista: 20000,
            precioContado: 18000,
            precioOferta: 15000,
        },
        {
            sku: '012',
            nombre: 'Estantería baja',
            descripcion: 'Estantería para libros y adornos',
            precioLista: 25000,
            precioContado: 22000,
            precioOferta: 0,
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería crear un PDF con items a media hoja', () => {
        generarPDFHalf(mockItems);
        const PDF = (jsPDF as any).mock.results[0].value;

        expect(PDF.roundedRect).toHaveBeenCalled();
        expect(PDF.text).toHaveBeenCalledWith(expect.stringContaining('SKU: 789'), expect.any(Number), expect.any(Number));
        expect(PDF.text).toHaveBeenCalledWith(expect.arrayContaining(['SILLÓN RELAX']), expect.any(Number), expect.any(Number));
        expect(PDF.text).toHaveBeenCalledWith(expect.stringContaining('OFERTA: $15000.00'), expect.any(Number), expect.any(Number));

        // Validar solo que se haya insertado imagen
        expect(PDF.addImage).toHaveBeenCalled();
        expect(PDF.save).toHaveBeenCalled();
    });

    it('no debería aplicar tachado si no hay precioOferta', () => {
        generarPDFHalf([mockItems[1]]);
        const PDF = (jsPDF as any).mock.results[0].value;
        expect(PDF.line).not.toHaveBeenCalled();
    });
});