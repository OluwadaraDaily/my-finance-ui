export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  data: {
    user: Record<string, unknown>;
    accessToken: string;
    refreshToken: string;
  },
  message: string;
}

// Extend AxiosRequestConfig to include retry flag
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
} 