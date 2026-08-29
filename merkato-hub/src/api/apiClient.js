/**
 * Centralized API client for MerkatoHub
 * Connects to Express REST API with Supabase backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getHeaders(customHeaders = {}) {
    const token = localStorage.getItem('merkatohub_token');
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.headers),
      ...options,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        localStorage.removeItem('merkatohub_token');
        localStorage.removeItem('merkatohub_user');
        // Do not force hard reload in development mock mode
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // In dev mode when offline/no backend server running, services fall back gracefully to mock store
      console.warn(`[ApiClient] Request to ${endpoint} failed: ${error.message}`);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PUT', body, ...options });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PATCH', body, ...options });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
