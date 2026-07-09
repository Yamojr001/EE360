import axios, { AxiosInstance, AxiosError } from 'axios';

let apiClient: AxiosInstance;

export function initializeApiClient() {
  // For client-side, use relative URLs (same origin)
  // For server-side, can use NEXT_PUBLIC_API_URL if needed
  const baseURL = typeof window !== 'undefined' 
    ? '' // Relative URLs for client
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

  apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies
  });

  // Response interceptor for handling errors
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // Handle 401 Unauthorized - try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Call refresh endpoint
          const response = await apiClient.post('/api/auth/refresh');
          
          if (response.status === 200) {
            // Retry original request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
}

export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    initializeApiClient();
  }
  return apiClient;
}

/**
 * Generic API request handler with offline support
 */
export async function apiRequest<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: any,
  options?: any
): Promise<T> {
  const client = getApiClient();

  try {
    const response = await client[method](url, data, options);
    return response.data;
  } catch (error) {
    // Check if we're offline
    if (!navigator.onLine) {
      console.warn(`[API] Offline - ${method.toUpperCase()} ${url}`);
      // Try to get from cache or queue for sync
      // This will be handled by service worker
    }
    throw error;
  }
}
