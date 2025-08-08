// src/services/auth.ts
import api from './api';
import { AxiosError } from 'axios';

interface LoginParams {
  username: string;
  password: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: UserData;
}

export const authService = {
  async login({ username, password }: LoginParams): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { username, password });
      
      // Armazena os dados de autenticação
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('heheheheeeeeeeeeeeeeeee')
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Tratamento básico de erros
      if (axiosError.response?.status === 401) {
        throw new Error('username ou senha incorretos');
      }
      
      throw new Error('Falha na conexão. Tente novamente mais tarde.');
    }
  },

  logout(): void {
    // Remove todos os dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): UserData | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    // Verificação simples baseada na presença do token
    return !!localStorage.getItem('token');
  },

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
};