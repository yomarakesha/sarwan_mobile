import { Warehouse } from '../types/models';
import api from './api';

export const adminWarehousesService = {
    /** GET /admin/warehouses */
    getAll: () => api.get<Warehouse[]>('/admin/warehouses'),

    /** POST /admin/warehouses */
    add: (data: { name: string; addresses?: string[]; phones?: string[] }) =>
        api.post<Warehouse>('/admin/warehouses', data),

    /** PUT /admin/warehouses/:id */
    update: (id: number, data: { name?: string; addresses?: string[]; phones?: string[] }) =>
        api.put<Warehouse>(`/admin/warehouses/${id}`, data),

    /** PATCH /admin/warehouses/:id/block */
    block: (id: number) => api.patch<Warehouse>(`/admin/warehouses/${id}/block`),

    /** PATCH /admin/warehouses/:id/unblock */
    unblock: (id: number) => api.patch<Warehouse>(`/admin/warehouses/${id}/unblock`),
};

export default adminWarehousesService;
