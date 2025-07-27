// src/hooks/useSyncSelected.ts
import { useEffect } from 'react';
import type {Item} from '../types/item';


export function useSyncSelected<T extends Item>(
    editableItems: T[],
    setSelected: React.Dispatch<React.SetStateAction<T[]>>
) {
    useEffect(() => {
        setSelected(prevSelected =>
            prevSelected.filter(sel =>
                editableItems.some(item => item.sku === sel.sku)
            )
        );
    }, [editableItems, setSelected]);
}
