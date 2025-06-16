import { toast } from 'sonner';
import api from '../axios';
import { APIResponse, AuthResponse, User } from '@/types/auth';
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
    const returnUrl = '/auth/login';
    
    // Clear cookies first
    await fetch('/api/auth/tokens', {
      method: 'DELETE',
      credentials: 'include',
    }).catch(console.error);

    // Show success message
    toast.success("Logged out successfully");

    // Cleanup in background
    api.post('/auth/logout', {
      access_token: getCookie('access_token'),
    }).catch(console.error);

    // Navigate after cookies are cleared
    window.location.href = returnUrl;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  async validateToken(token: string): Promise<boolean> {
    const response = await api.post('/auth/validate-token', {
      access_token: token,
    });
    return response.status === 200;
  },

  async getUserInfo(): Promise<APIResponse<User>> {
    const response = await api.get('/users/me');
    return response.data as APIResponse<User>;
  }
}; 