import type {Item} from "../types/item.ts";

export function eliminarSeleccionados({
                                   data,
                                   selected,
                                   setData,
                                   setSelected,
                               }: {
    data: Item[];
    selected: Item[];
    setData: (items: Item[]) => void;
    setSelected: (items: Item[]) => void;
}) {
    const nuevos = data.filter(
        item => !selected.some(sel => sel.sku === item.sku)
    );

    setData(nuevos);
    setSelected([]);

    try {
        const stored = localStorage.getItem('productos');
        if (stored) {
            const parsed = JSON.parse(stored);
            parsed.items = nuevos;
            localStorage.setItem('productos', JSON.stringify(parsed));
        }
    } catch {
        console.warn('No se pudo actualizar localStorage');
    }
}
