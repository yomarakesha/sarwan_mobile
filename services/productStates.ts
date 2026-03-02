import { ProductState } from '../types/models';
import api from './api';

export const productStatesService = {
    /** GET /admin/product-states */
    getAll: () => api.get<ProductState[]>('/admin/product-states'),

    /** POST /admin/product-states */
    add: (name: string) => api.post<ProductState>('/admin/product-states', { name }),

    /** PUT /admin/product-states/:id */
    update: (id: number, name: string) =>
        api.put<ProductState>(`/admin/product-states/${id}`, { name }),

    /** PATCH /admin/product-states/:id/block */
    block: (id: number) => api.patch<ProductState>(`/admin/product-states/${id}/block`),

    /** PATCH /admin/product-states/:id/unblock */
    unblock: (id: number) => api.patch<ProductState>(`/admin/product-states/${id}/unblock`),
};

export default productStatesService;
