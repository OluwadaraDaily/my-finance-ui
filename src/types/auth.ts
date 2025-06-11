export interface User {
  id: string;
  email: string;
  username: string;
  is_activated: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthResponse {
  data: {
    user: Record<string, unknown>;
    accessToken: string;
    refreshToken: string;
  },
  message: string;
}

export interface APIResponse<T> {
  data: T;
  message: string;
}

// Extend AxiosRequestConfig to include retry flag
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
} 