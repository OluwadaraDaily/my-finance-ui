import { ApiError, ApiResponse } from '@/types/api';
import { AxiosError } from 'axios';

export const handleApiError = (error: AxiosError<ApiError>): ApiError => {
  if (error.response) {
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
      code: error.response.data.code
    };
  }
  
  if (error.request) {
    return {
      message: 'No response received from server',
      status: 503
    };
  }
  
  return {
    message: error.message || 'Unknown error occurred',
    status: 500
  };
};

export const createApiResponse = <T>(data: T, status = 200, message?: string): ApiResponse<T> => {
  return {
    data,
    status,
    message
  };
}; 