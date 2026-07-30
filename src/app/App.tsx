import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/home/HomePage';
import { ManifestoPage } from '../pages/manifesto/ManifestoPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/manifesto" element={<ManifestoPage />} />
        <Route path="/manifest" element={<Navigate to="/manifesto" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
