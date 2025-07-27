import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Print from './pages/Print';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/print" element={<Print />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
