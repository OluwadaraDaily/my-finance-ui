export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
} 