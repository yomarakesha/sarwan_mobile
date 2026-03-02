import { Brand } from '../types/models';
import api from './api';

export const brandsService = {
    /** GET /admin/brands */
    getAll: () => api.get<Brand[]>('/admin/brands'),

    /** POST /admin/brands */
    add: (name: string) => api.post<Brand>('/admin/brands', { name }),

    /** PUT /admin/brands/:id */
    update: (id: number, name: string) =>
        api.put<Brand>(`/admin/brands/${id}`, { name }),

    /** PATCH /admin/brands/:id/block */
    block: (id: number) => api.patch<Brand>(`/admin/brands/${id}/block`),

    /** PATCH /admin/brands/:id/unblock */
    unblock: (id: number) => api.patch<Brand>(`/admin/brands/${id}/unblock`),
};

export default brandsService;
