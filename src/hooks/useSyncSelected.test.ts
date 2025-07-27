// src/hooks/useSyncSelected.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import { useSyncSelected } from './useSyncSelected';
import type { Item } from '../types/item';

describe('useSyncSelected', () => {
    const itemsOriginales: Item[] = [
        {
            sku: '1',
            nombre: 'Mesa',
            descripcion: '',
            precioLista: 0,
            precioContado: 0,
            precioOferta: 0,
        },
        {
            sku: '2',
            nombre: 'Silla',
            descripcion: '',
            precioLista: 0,
            precioContado: 0,
            precioOferta: 0,
        },
        {
            sku: '3',
            nombre: 'Sillón',
            descripcion: '',
            precioLista: 0,
            precioContado: 0,
            precioOferta: 0,
        },
    ];

    it('debería eliminar seleccionados que ya no existen en editableItems', () => {

        const { result, rerender } = renderHook(
            () => {
                const [editableItems, setEditableItems] = useState<Item[]>(itemsOriginales);
                const [selectedState, setSelectedState] = useState<Item[]>([
                    { ...itemsOriginales[0] },
                    {
                        sku: '999',
                        nombre: 'Fantasma',
                        descripcion: '',
                        precioLista: 0,
                        precioContado: 0,
                        precioOferta: 0,
                    },
                ]);

                useSyncSelected(editableItems, setSelectedState);

                return { editableItems, setEditableItems, selected: selectedState };
            }
        );

        act(() => {
            result.current.setEditableItems([itemsOriginales[0], itemsOriginales[1]]);
        });

        rerender(); // 👈 fuerza actualización para que el efecto se refleje

        expect(result.current.selected).toEqual([itemsOriginales[0]]);
    });

    it('no modifica seleccionados si todos siguen existiendo', () => {
        const { result } = renderHook(() => {
            const [editableItems] = useState<Item[]>(itemsOriginales);
            const [selected, setSelected] = useState<Item[]>([itemsOriginales[0]]);

            useSyncSelected(editableItems, setSelected);

            return { selected };
        });

        expect(result.current.selected).toEqual([itemsOriginales[0]]);
    });
});
