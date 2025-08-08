// src/components/Header.tsx
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { logout } = useAuth();
  
  return (
    <header className="bg-gray-800 text-white p-4">
      <button 
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        Sair
      </button>
    </header>
  );
};