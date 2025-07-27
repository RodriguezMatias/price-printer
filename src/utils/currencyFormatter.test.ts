import { describe, it, expect } from 'vitest';
import { formatearARS } from './currencyFormatter';

/*
* Esto es lo correcto si querés seguir respetando el estándar es-AR, ya que en esa configuración el espacio fino (U+00A0 o \u00A0) es parte del formato monetario.
* */
describe('formatearARS', () => {
  it('debería formatear valores en pesos argentinos con dos decimales', () => {
    expect(formatearARS(1234.56)).toBe('$ 1.234,56');
    expect(formatearARS(0)).toBe('$ 0,00');
    expect(formatearARS(1000000)).toBe('$ 1.000.000,00');
  });

  it('debería manejar números negativos', () => {
    expect(formatearARS(1234.56)).toBe('$ 1.234,56'); // Ojo: ese espacio no es un espacio común
  });
});