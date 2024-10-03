import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfileRoutes from './routes/profileRoutes';

function App() {
    return (
    <Router>
        <Routes>
            <Route path="/profile/*" element={<ProfileRoutes />} />
            <Route path="/" element={<h1>Welcome to SLU Reuse</h1>} />
        </Routes>
    </Router>
    );
}

export default App;