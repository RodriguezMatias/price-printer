import { useEffect, useState } from 'react';
import LoginPassword from './components/LoginPassword';
import Home from "./pages/Home.tsx";

function App() {
    const [accesoPermitido, setAccesoPermitido] = useState(false);

    useEffect(() => {
        const flag = localStorage.getItem('accesoAutorizado');
        if (flag === 'true') {
            setAccesoPermitido(true);
        }
    }, []);

    if (!accesoPermitido) {
        return <LoginPassword onSuccess={() => setAccesoPermitido(true)} />;
    }

    return <Home/>;
}

export default App;
