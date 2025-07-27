import {useRef} from "react";

type Props = {
    onData: (data: any) => void;
};

export default function UploadJson({ onData }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                onData(json);
            } catch {
                alert('Archivo JSON inválido');
            }

            // ✅ Resetea el valor del input para permitir subir el mismo archivo
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        };

        reader.readAsText(file);
    };

    return (
        <label
            style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#007aff',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 16,
            }}
        >
            📂 Cargar archivo JSON
            <input
                type="file"
                accept="application/json"
                ref={inputRef}
                onChange={handleFile} hidden
            />
        </label>
    );
}

