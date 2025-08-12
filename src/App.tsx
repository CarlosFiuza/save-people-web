// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthProvider';
import PersonsDashboard from './pages/PersonDashboard';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<PersonsDashboard />} />
          {/* Adicione outras rotas protegidas aqui */}
        </Route>

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
}