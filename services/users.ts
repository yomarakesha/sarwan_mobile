import { CreateUserData, UpdateUserData, User } from '../types/models';
import api from './api';

export const usersService = {
    /** GET /users  (optional ?role=) */
    getAll: (role?: string) => {
        const params = role ? { role } : undefined;
        return api.get<User[]>('/users', params);
    },

    /** POST /users */
    add: (data: CreateUserData) => api.post<User>('/users', data),

    /** PUT /users/:id */
    update: (id: number, data: UpdateUserData) =>
        api.put<User>(`/users/${id}`, data),

    /** PATCH /users/:id/block */
    block: (id: number) =>
        api.patch<{ message: string; user: User }>(`/users/${id}/block`),

    /** PATCH /users/:id/unblock */
    unblock: (id: number) =>
        api.patch<{ message: string; user: User }>(`/users/${id}/unblock`),
};

export default usersService;
