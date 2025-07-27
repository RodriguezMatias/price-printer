
type Item = {
  sku: string;
  nombre: string;
  descripcion: string;
  precioLista: number;
  precioContado: number;
  precioOferta: number;
};

type Props = {
  item: Item;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function EliminarItemModal({ item, onConfirm, onCancel }: Props) {
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
        zIndex: 999,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: 24,
          borderRadius: 8,
          maxWidth: 400,
          width: '90%',
          boxShadow: '0 0 10px rgba(0,0,0,0.25)',
        }}
      >
        <h3>¿Eliminar ítem?</h3>
        <p>
          ¿Estás seguro de que querés eliminar <strong>{item.nombre}</strong>?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={onConfirm} style={{ backgroundColor: '#d9534f', color: '#fff' }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}