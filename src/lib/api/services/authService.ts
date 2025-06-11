import { toast } from 'sonner';
import api from '../axios';
import { AuthResponse } from '@/types/auth';
import { getCookie } from '@/utils/cookies';

interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    try {
      const response = await api.post('/auth/register', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    // Store tokens in HTTP-only cookies
    await fetch('/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: response.data.data.access_token,
        refreshToken: response.data.data.refresh_token,
      }),
      credentials: 'include',
    });

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {
        access_token: getCookie('access_token'),
      });
    } finally {
      // Always clear cookies
      await fetch('/api/auth/tokens', {
        method: 'DELETE',
        credentials: 'include',
      });

      toast.success("Logged out successfully");
      
      // Redirect to login
      window.location.href = '/auth/login';
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  }
}; 