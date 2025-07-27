type Props = {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function BorrarTodoModal({ visible, onCancel, onConfirm }: Props) {
    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 999
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: 24,
                borderRadius: 8,
                width: '90%',
                maxWidth: 400,
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
                <h2>¿Borrar todos los productos?</h2>
                <p>Esta acción eliminará todos los productos cargados. ¿Estás seguro?</p>
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            backgroundColor: '#ccc',
                            padding: '8px 16px',
                            borderRadius: 4,
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: '#e74c3c',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: 4,
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Borrar todo
                    </button>
                </div>
            </div>
        </div>
    );
}
