
const BASE_URL = 'http://localhost:3001/api';

class ApiClient {
  private accessToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  setToken(token: any) {
    if (typeof token !== 'string') {
      console.error('[ApiClient] Attempted to set a non-string token:', token);
      return;
    }
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  clearToken() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  getToken() {
    return this.accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Ensure we have the latest token
    if (!this.accessToken && typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }

    const headers = new Headers(options.headers);

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    } else {
      console.warn(`[ApiClient] No access token found for request to ${endpoint}`);
    }

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    console.log(`[ApiClient] ${options.method || 'GET'} ${url}`, {
      headers: Object.fromEntries(headers.entries()),
      body: options.body
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Handle token expiration or unauthorized access
      this.clearToken();

      // Also clear the persisted Zustand auth state to prevent redirect loops
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('flo-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.state) {
              parsed.state.isAuthenticated = false;
              parsed.state.githubUser = null;
              localStorage.setItem('flo-storage', JSON.stringify(parsed));
            }
          }
        } catch (e) {
          // If parsing fails, just remove the whole thing
          localStorage.removeItem('flo-storage');
        }
        window.location.href = '/auth';
      }
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw {
        statusCode: response.status,
        error: data.error || 'Unknown Error',
        message: data.message || 'Something went wrong',
      };
    }

    return data as T;
  }

  get<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any, options: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options: RequestInit = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
