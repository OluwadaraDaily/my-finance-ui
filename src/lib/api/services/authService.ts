import api from '../axios';
import { AuthResponse } from '@/types/auth';

interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    try {
      const response = await api.post('/auth/register', payload);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    console.log("RESPONSE =>", response);

    // Store tokens in HTTP-only cookies
    await fetch('/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }),
      credentials: 'include',
    });

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await api.post('/auth/logout');
    } finally {
      // Always clear cookies
      await fetch('/api/auth/tokens', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      // Redirect to login
      window.location.href = '/login';
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  }
}; 