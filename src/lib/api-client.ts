import { getSessionToken, clearSessionToken } from './session';

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${getApiBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getSessionToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      clearSessionToken();
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: json.message || json.error || `HTTP ${res.status}: ${res.statusText}`,
        statusCode: res.status,
      };
    }

    return {
      success: true,
      data: (json.data !== undefined ? json.data : json) as T,
      statusCode: res.status,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network communication failure';
    return {
      success: false,
      error: message,
    };
  }
}

export const apiClient = {
  get: <T = unknown>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T = unknown>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = unknown>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};
