import { Platform } from 'react-native';

/**
 * Base API client for Sarwan backend
 * 
 * Android emulator uses 10.0.2.2 to reach host localhost.
 * iOS simulator and web use localhost directly.
 */
const getBaseUrl = (): string => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000/api/admin';
    }
    return 'http://localhost:5000/api/admin';
};

export const BASE_URL = getBaseUrl();

class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Ошибка ${response.status}`;
        throw new ApiError(errorMessage, response.status);
    }

    return data as T;
}

const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
};

export const api = {
    async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        let url = `${BASE_URL}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: defaultHeaders,
            credentials: 'include',
        });

        return handleResponse<T>(response);
    },

    async post<T>(endpoint: string, body?: unknown): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: defaultHeaders,
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
        });

        return handleResponse<T>(response);
    },

    async put<T>(endpoint: string, body?: unknown): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: defaultHeaders,
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
        });

        return handleResponse<T>(response);
    },

    async patch<T>(endpoint: string, body?: unknown): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: defaultHeaders,
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
        });

        return handleResponse<T>(response);
    },

    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: defaultHeaders,
            credentials: 'include',
        });

        return handleResponse<T>(response);
    },
};

export default api;
