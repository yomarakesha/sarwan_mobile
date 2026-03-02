import { LoginCredentials } from '../types/models';
import api from './api';

export interface AuthUser {
    id: number;
    username: string;
    role: string;
    full_name?: string;
}

export const authService = {
    /** POST /auth/login */
    login: (credentials: LoginCredentials) =>
        api.post<{ status: string; user: AuthUser }>('/auth/login', credentials),

    /** GET /auth/me */
    me: () =>
        api.get<{ authenticated: boolean; user?: AuthUser }>('/auth/me'),

    /** POST /auth/logout */
    logout: () =>
        api.post<{ status: string; message: string }>('/auth/logout'),
};

export default authService;
