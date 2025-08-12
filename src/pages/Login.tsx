// src/pages/Login.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { isAxiosError } from 'axios';
import useToast from '../hooks/useToast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const toast = useToast();

  const isSessionExpired = !!searchParams.get('session_expired');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Adicione esta linha para prevenir propagação
    
    // Validação básica
    if (!username.trim() || !password.trim()) {
      toast.showWarning('Preencha todos os campos');
      return;
    }
    
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard', { replace: true }); // Use replace: true para evitar histórico duplo
    } catch (err: unknown) {
      // Tratamento de erro aprimorado
      let errorMessage = 'Usuário ou senha inválidos';
      
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Credenciais inválidas';
        } else if (err.response.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        }
      } else if (isAxiosError(err) && err.request) {
        errorMessage = 'Sem resposta do servidor. Verifique sua conexão.';
      }
      
      toast.showError(errorMessage);
      setUsername('');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isSessionExpired && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Sua sessão expirou. Por favor, faça login novamente.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold">
            Acesse sua conta
          </h2>
        </div>

        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
          noValidate // Impede validação nativa do navegador
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Nome de usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full pl-10 pr-3 py-3 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading} // Desabilita durante loading
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border text-gray-800 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading} // Desabilita durante loading
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Carregando...
                </span>
              ) : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}