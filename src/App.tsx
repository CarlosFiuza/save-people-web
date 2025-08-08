// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import PersonList from './pages/Persons/List';
import { AuthProvider } from './contexts/AuthProvider';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/persons" element={<PersonList />} />
            {/* Adicione outras rotas protegidas aqui */}
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}