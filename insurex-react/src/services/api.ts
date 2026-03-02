import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: any) => void;
}

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
          console.error('❌ API Error:', error.response?.data || error.message);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.api(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          return new Promise((resolve, reject) => {
            this.refreshToken()
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                this.processQueue(null, token);
                resolve(this.api(originalRequest));
              })
              .catch((err) => {
                this.processQueue(err, null);
                reject(err);
              })
              .finally(() => {
                this.isRefreshing = false;
              });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        refreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return token;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  private processQueue(error: Error | null, token: string | null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  public getClient(): AxiosInstance {
    return this.api;
  }
}

export const api = new ApiService().getClient();
