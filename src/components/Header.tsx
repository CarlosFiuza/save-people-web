import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const { logout } = useAuth();
  
  return (
    <header className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Uma Aplicação </h1>
          <button 
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Sair
          </button>
      </div>
    </header>
  );
};
