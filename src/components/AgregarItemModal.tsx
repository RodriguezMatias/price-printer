import { useState } from 'react';

type Item = {
    sku: string;
    nombre: string;
    descripcion: string;
    precioLista: number;
    precioContado: number;
    precioOferta: number;
};

type Props = {
    onClose: () => void;
    onSave: (item: Item) => void;
    nextSku: string;
};

export default function AgregarItemModal({ onClose, onSave, nextSku }: Props) {
    const [form, setForm] = useState<Item>({
        sku: nextSku,
        nombre: '',
        descripcion: '',
        precioLista: 0,
        precioContado: 0,
        precioOferta: 0,
    });

    const [error, setError] = useState('');

    const handleChange = (field: keyof Item, value: string | number) => {
        setForm((prev) => ({
            ...prev,
            [field]: typeof prev[field] === 'number'
                ? Math.max(0, parseFloat(value as string) || 0)
                : value,
        }));
    };

    const handleSubmit = () => {
        if (!form.nombre.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        if (
            form.precioLista < 0 ||
            form.precioContado < 0 ||
            form.precioOferta < 0
        ) {
            setError('Los precios no pueden ser negativos');
            return;
        }

        if (form.nombre.length > 20){
            setError('El nombre es muy largo, maximo 20 caracteres.');
            return;
        }
        if (form.descripcion.length > 40){
            setError('La descripcion es muy larga, maximo 40 caracteres.');
            return;
        }


        setError('');
        onSave(form);
        onClose();
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: 24,
                    borderRadius: 8,
                    width: '100%',
                    maxWidth: 500,
                    boxShadow: '0 0 12px rgba(0,0,0,0.25)',
                }}
            >
                <h2>Agregar nuevo ítem</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <p>SKU: <strong>{form.sku}</strong></p>

                    <div>
                        <label>Nombre:  (Max 20 caracteres)</label>
                        <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => handleChange('nombre', e.target.value)}
                            placeholder="Ej: Silla de madera"
                        />
                    </div>

                    <div>
                        <label>Descripción: (Max 40 caracteres)</label>
                        <input
                            type="text"
                            value={form.descripcion}
                            onChange={(e) => handleChange('descripcion', e.target.value)}
                            placeholder="Ej: Con respaldo alto"
                        />
                    </div>

                    <hr />

                    <div>
                        <label>Precio Lista:</label>
                        <input
                            type="number"
                            value={form.precioLista}
                            min={0}
                            onChange={(e) => handleChange('precioLista', e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Precio Contado:</label>
                        <input
                            type="number"
                            value={form.precioContado}
                            min={0}
                            onChange={(e) => handleChange('precioContado', e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Precio Oferta:</label>
                        <input
                            type="number"
                            value={form.precioOferta}
                            min={0}
                            onChange={(e) => handleChange('precioOferta', e.target.value)}
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'red', fontSize: 14 }}>{error}</p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button onClick={onClose}>Cancelar</button>
                        <button onClick={handleSubmit}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
