import { useEffect, useState } from 'react';
import UploadJson from '../components/UploadJson';
import ItemTable from '../components/ItemTable';
import AgregarItemModal from '../components/AgregarItemModal';
import BorrarTodoModal from "../components/BorrarTodoModal.tsx";

type Item = {
    sku: string;
    nombre: string;
    descripcion: string;
    precioLista: number;
    precioContado: number;
    precioOferta: number;
};

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
                backgroundColor: '#f4f4f4',
                minHeight: '100vh',
                width: '100vw',
                padding: '40px 40px',
                fontFamily: 'Arial, sans-serif',
                color: '#1a1a1a',
                boxSizing: 'border-box',
            }}
        >
            <div style={{display: 'flex', flexDirection: 'row', gap: 20}}>
                <div style={{display: 'flex', flexDirection: 'column',margin:10}}>
                <h1 style={{ fontSize: 36, marginBottom: 8 }}>📋 Item Printer</h1>

                <p style={{ fontSize: 18, marginBottom: 24, color: '#444' }}>
                    Si ya tenes datos guardados,subí un archivo <strong>.json</strong> con los productos para generar etiquetas de precios.
                </p>
                </div>
                <div
                    style={{
                        padding: '32px 24px',
                        backgroundColor: '#ffffff',
                        border: '2px dashed #ccc',
                        borderRadius: 12,
                        textAlign: 'center',
                        marginBottom: 48,
                        maxWidth: 1000,
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

            <div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setShowModal(true)}>➕ Agregar ítem</button>
                    <button onClick={handleExportarJson}>📥 Guardar cambios en archivo .json</button>
                </div>
                <h2 style={{ fontSize: 24, marginBottom: 16 }}>🧾 Items</h2>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        marginBottom: 16
                    }}
                >
                    🗑 Borrar todos los items
                </button>
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