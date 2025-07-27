import { useState } from 'react';
import './LoginPassword.css'; // Importamos el CSS

type Props = {
    onSuccess: () => void;
};

export default function LoginPassword({ onSuccess }: Props) {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const expected = import.meta.env.VITE_APP_PASSWORD;
        if (input === expected) {
            localStorage.setItem('accesoAutorizado', 'true');
            onSuccess();
        } else {
            setError(true);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">🔒 Acceso Restringido</h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="password"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Contraseña"
                        autoFocus
                        className="login-input"
                    />

                    {error && (
                        <p className="login-error">Contraseña incorrecta. Intentá de nuevo.</p>
                    )}

                    <button type="submit" className="login-button">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
