// src/services/auth.ts
import { TOKEN_KEY, USER_KEY } from '../types';
import api from './api';
import { AxiosError } from 'axios';

interface LoginParams {
  username: string;
  password: string;
}

interface UserData {
  id: string;
}

interface AuthResponse {
  access_token: string;
  user_id: number;
}

export const authService = {
  async login({ username, password }: LoginParams): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { username, password });
      
      localStorage.setItem(TOKEN_KEY, response.data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify({ id: response.data.user_id }));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        throw new Error('username ou senha incorretos');
      }
      
      throw new Error('Falha na conexão. Tente novamente mais tarde.');
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): UserData | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    const hasTokenInCache = !!localStorage.getItem(TOKEN_KEY);
    return hasTokenInCache;
  },

  getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
};