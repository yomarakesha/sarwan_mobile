import { CreateUserData, UpdateUserData, User } from '../types/models';
import api from './api';

export const usersService = {
    /** GET /admin/users  (optional ?role=) */
    getAll: (role?: string) => {
        const params = role ? { role } : undefined;
        return api.get<User[]>('/admin/users', params);
    },

    /** POST /admin/users */
    add: (data: CreateUserData) => api.post<User>('/admin/users', data),

    /** PUT /admin/users/:id */
    update: (id: number, data: UpdateUserData) =>
        api.put<User>(`/admin/users/${id}`, data),

    /** PATCH /admin/users/:id/block */
    block: (id: number) =>
        api.patch<{ message: string; user: User }>(`/admin/users/${id}/block`),

    /** PATCH /admin/users/:id/unblock */
    unblock: (id: number) =>
        api.patch<{ message: string; user: User }>(`/admin/users/${id}/unblock`),
};

export default usersService;
