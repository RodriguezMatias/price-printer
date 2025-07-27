import { useState, useEffect } from 'react';
import {generarPDF} from "../utils/generarPDF.ts";
import EliminarItemModal from "./EliminarItemModal.tsx";
import {generarPDFHalf} from "../utils/generarPDFHalf.ts";

type Item  = {
    sku: string;
    nombre: string;
    descripcion: string;
    precioLista: number;
    precioContado: number;
    precioOferta: number;
};

type Props = {
    items: Item[];
    onChange?: (items: Item[]) => void; // ✅ Agregado
};


export default function ItemTable({ items, onChange }: Props) {
    const [editableMode, setEditableMode] = useState(false);
    const [selected, setSelected] = useState<Item[]>([]);
    const [editableItems, setEditableItems] = useState<Item[]>([]);
    const [itemAEliminar, setItemAEliminar] = useState<Item | null>(null);
    const [nombreFiltro, setNombreFiltro] = useState('');


    useEffect(() => {
        setEditableItems(items);
    }, [items]);

    useEffect(() => {
        setSelected(prevSelected =>
            prevSelected.filter((sel) =>
                editableItems.some((item) => item.sku === sel.sku)
            )
        );
    }, [editableItems]);


    const updateItem = (sku: string, field: keyof Item, value: string | number) => {
        const updated = editableItems.map((item) => {
            if (item.sku !== sku) return item;

            const parsedValue = typeof item[field] === 'number'
                ? parseFloat(value as string) || 0
                : value;

            return { ...item, [field]: parsedValue };
        });

        setEditableItems(updated);

        if (onChange) onChange(updated);

        const stored = localStorage.getItem('productos');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                parsed.items = updated;
                localStorage.setItem('productos', JSON.stringify(parsed));
            } catch {
                console.warn('No se pudo guardar en localStorage');
            }
        }
    };


    const toggleSelect = (item: Item) => {
        setSelected((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const toggleSelectAll = () => {
        const allSelected = editableItems.every((item) => selected.includes(item));
        if (allSelected) {
            setSelected((prev) => prev.filter((i) => !editableItems.includes(i)));
        } else {
            setSelected((prev) => [
                ...prev,
                ...editableItems.filter((i) => !prev.includes(i)),
            ]);
        }
    };

    const itemsFiltrados = editableItems.filter(item =>
        item.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())
    );


    return (
        <div>
            <button onClick={() => setEditableMode(!editableMode)} style={{ marginBottom: 16 }}>
                {editableMode ? '✅ Finalizar edición' : '✏️ Editar ítems'}
            </button>

            <p style={{ fontStyle: 'italic', marginBottom: 8 }}>
                {editableMode ? 'Total de ' : 'Editando '}{editableItems.length} productos
            </p>

            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Filtrar por nombre..."
                    value={nombreFiltro}
                    onChange={(e) => setNombreFiltro(e.target.value)}
                    style={{
                        padding: '6px 8px',
                        borderRadius: 4,
                        border: '1px solid #ccc',
                        fontSize: 14,
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                />
            </div>


            <table border={1} cellPadding={6} style={{ width: '100%' }}>
                <thead>
                <tr>
                    <th>
                        Todos
                        <input
                            type="checkbox"
                            checked={
                                editableItems.length > 0 &&
                                editableItems.every((item) => selected.includes(item))
                            }
                            onChange={toggleSelectAll}
                            disabled={editableMode} // ✅ desactivar si está editando
                            style={{
                                backgroundColor: '#fff',
                                color: '#000',
                                border: '1px solid #ccc',
                                padding: '6px 8px',
                                borderRadius: 4,
                                width: '100%',
                                boxSizing: 'border-box',
                                fontSize: 14,
                            }}
                        />
                    </th>
                    <th>Sku</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio Lista</th>
                    <th>Precio Contado</th>
                    <th>Precio Oferta (Opcional)</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {itemsFiltrados.map((item) => (
                    <tr key={item.sku}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selected.includes(item)}
                                onChange={() => toggleSelect(item)}
                                disabled={editableMode} // ✅ desactivar si está editando
                                style={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    border: '1px solid #ccc',
                                    padding: '6px 8px',
                                    borderRadius: 4,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    fontSize: 14,
                                }}
                            />
                        </td>
                        <td>{item.sku}</td>
                        <td>
                            {editableMode ? (
                                <input
                                    type="text"
                                    value={item.nombre}
                                    onChange={(e) => updateItem(item.sku, 'nombre', e.target.value)}
                                    disabled={!editableMode}
                                    style={{
                                        backgroundColor: '#fff',
                                        color: '#000',
                                        border: '1px solid #ccc',
                                        padding: '6px 8px',
                                        borderRadius: 4,
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        fontSize: 14,
                                    }}
                                />
                            ) : (
                                item.nombre
                            )}
                        </td>

                        <td>
                            {editableMode ? (
                                <input
                                    type="text"
                                    value={item.descripcion}
                                    onChange={(e) => updateItem(item.sku, 'descripcion', e.target.value)}
                                    disabled={!editableMode}
                                    style={{
                                        backgroundColor: '#fff',
                                        color: '#000',
                                        border: '1px solid #ccc',
                                        padding: '6px 8px',
                                        borderRadius: 4,
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        fontSize: 14,
                                    }}
                                />
                            ) : (
                                item.descripcion
                            )}
                        </td>
                        <td>
                            {editableMode ? (
                                <input
                                    type="number"
                                    value={item.precioLista}
                                    onChange={(e) => updateItem(item.sku, 'precioLista', e.target.value)}
                                    disabled={!editableMode}
                                    style={{
                                        backgroundColor: '#fff',
                                        color: '#000',
                                        border: '1px solid #ccc',
                                        padding: '6px 8px',
                                        borderRadius: 4,
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        fontSize: 14,
                                    }}
                                />
                            ) : (
                                new Intl.NumberFormat('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                }).format(item.precioLista)
                            )}
                        </td>
                        <td>
                            {editableMode ? (
                                <input
                                    type="number"
                                    value={item.precioContado}
                                    onChange={(e) => updateItem(item.sku, 'precioContado', e.target.value)}
                                    disabled={!editableMode}
                                    style={{
                                        backgroundColor: '#fff',
                                        color: '#000',
                                        border: '1px solid #ccc',
                                        padding: '6px 8px',
                                        borderRadius: 4,
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        fontSize: 14,
                                    }}
                                />
                            ) : (
                                new Intl.NumberFormat('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                }).format(item.precioContado)
                            )}
                        </td>
                        <td>
                            {editableMode ? (
                                <input
                                    type="number"
                                    value={item.precioOferta}
                                    onChange={(e) => updateItem(item.sku, 'precioOferta', e.target.value)}
                                    disabled={!editableMode}
                                    style={{
                                        backgroundColor: '#fff',
                                        color: '#000',
                                        border: '1px solid #ccc',
                                        padding: '6px 8px',
                                        borderRadius: 4,
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        fontSize: 14,
                                    }}
                                />
                            ) : (
                                new Intl.NumberFormat('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                }).format(item.precioOferta)
                            )}
                        </td>
                        <td>
                            <button onClick={() => setItemAEliminar(item)}>🗑 Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selected.length > 0 && !editableMode && (
                <button
                    onClick={() => generarPDF(selected)}
                    style={{ margin: 20 }}
                >
                    📄 Imprimir etiquetas tamaño completo ({selected.length})
                </button>
            )}
            {selected.length == 0 || editableMode && (
                <button disabled
                    style={{ margin: 20 }}
                >
                    📄 Imprimir etiquetas tamaño completo ({selected.length})
                </button>
            )}
            {selected.length == 0 && (
                <button disabled
                        style={{ margin: 20 }}
                >
                    📄 Imprimir etiquetas tamaño completo ({selected.length})
                </button>
            )}

            {selected.length > 0 && !editableMode && (
                <button
                    onClick={() => generarPDFHalf(selected)}
                    style={{ margin: 20 }}
                >
                    📄 Imprimir etiquetas a medio tamaño ({selected.length})
                </button>
            )}
            {selected.length == 0 || editableMode && (
                <button disabled
                        style={{ margin: 20 }}
                >
                    📄 Imprimir etiquetas a medio tamaño ({selected.length})
                </button>
            )}
            {selected.length == 0 && (
                <button disabled
                        style={{ margin: 20 }}
                >
                    📄 Imprimir etiquetas a medio tamaño ({selected.length})
                </button>
            )}
            {itemAEliminar && (
                <EliminarItemModal
                    item={itemAEliminar}
                    onCancel={() => setItemAEliminar(null)}
                    onConfirm={() => {
                        const actualizados = editableItems.filter((i) => i.sku !== itemAEliminar.sku);
                        setEditableItems(actualizados);
                        setItemAEliminar(null);

                        if (onChange) onChange(actualizados);

                        const stored = localStorage.getItem('productos');
                        if (stored) {
                            try {
                                const parsed = JSON.parse(stored);
                                parsed.items = actualizados;
                                localStorage.setItem('productos', JSON.stringify(parsed));
                            } catch {
                                console.warn('No se pudo actualizar localStorage');
                            }
                        }
                    }}
                />
            )}


        </div>
    );

}