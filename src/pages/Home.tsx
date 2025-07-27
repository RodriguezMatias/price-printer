import { useEffect, useState } from 'react';
import UploadJson from '../components/UploadJson';
import ItemTable from '../components/ItemTable';
import AgregarItemModal from '../components/AgregarItemModal';
import BorrarTodoModal from "../components/BorrarTodoModal.tsx";
import type {Item} from '../types/item';


export default function Home() {
    const [data, setData] = useState<Item[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('productos');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData(parsed.items || []);
            } catch {
                console.warn('JSON en localStorage no válido');
                setData([]);
            }
        }
    }, []);


    const handleExportarJson = () => {
        const json = {
            nombreNegocio: 'Exportado',
            descripcion: '',
            items: data,
        };

        const blob = new Blob([JSON.stringify(json, null, 2)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'productos_actualizados.json';
        link.click();
        URL.revokeObjectURL(url);
    };


    const handleAgregarDesdeModal = (item: Item) => {
        const actualizados = [...data, item];

        setData(actualizados);

        try {
            localStorage.setItem('productos', JSON.stringify({ items: actualizados }));
        } catch {
            console.warn('No se pudo actualizar el localStorage');
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleBorrarTodo = () => {
        setData([]);
        localStorage.removeItem('productos');
        setShowDeleteModal(false);
    };



    return (
        <div
            style={{
                background: '#ffffff',
                minHeight: '100vh',
                width: '100vw',
                padding: '40px 40px',
                fontFamily: 'Arial, sans-serif',
                boxSizing: 'border-box',
            }}
        >

            <h1 style={{ fontSize: 36, margin: 10 }}>📋 Item Printer</h1>

            <div style={{display: 'flex', flexDirection: 'row', gap: 20,border: '2px dashed #ccc',
                borderRadius: 12}}>
                <p style={{ fontSize: 18, margin: 10 }}>
                     Si ya tenes datos guardados,subí un archivo <strong>.json</strong> con los productos para generar etiquetas de precios:
                </p>
                <div
                    style={{
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: 12,
                        textAlign: 'center',
                        margin: 10,
                    }}
                >
                <UploadJson
                    onData={(json) => {
                        localStorage.setItem('productos', JSON.stringify(json));
                        setData(json.items);
                    }}
                />
                <p style={{ fontSize: 14, color: '#686666', marginTop: 12 }}>
                    Solo se acepta formato JSON con estructura válida.
                </p>
                </div>
            </div>

            <div style={{marginTop:20,padding: 10,border: '2px dashed #ccc', borderRadius: 12}}>
                <h2 style={{ fontSize: 24, marginBottom: 16 }}>🧾 Items</h2>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setShowModal(true)}>➕ Agregar ítem</button>
                    <button
                        onClick={handleExportarJson}
                        disabled={data.length === 0}
                        style={{
                            cursor: data.length === 0 ? 'not-allowed' : 'pointer',
                            opacity: data.length === 0 ? 0.5 : 1
                        }}
                    >
                        📥 Guardar cambios en archivo .json
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={data.length === 0}
                        style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            opacity: data.length === 0 ? 0.5 : 1,
                            cursor: data.length === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        🗑 Borrar todos los items
                    </button>
                </div>
                <ItemTable items={data} onChange={setData} />
            </div>
            {showModal && (
                <AgregarItemModal
                    onClose={() => setShowModal(false)}
                    onSave={handleAgregarDesdeModal}
                    nextSku={(data.length + 1).toString()}
                />
            )}
            <BorrarTodoModal
                visible={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleBorrarTodo}
            />
        </div>
    );
}