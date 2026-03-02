import { ProductType } from '../types/models';
import api from './api';

export const productTypesService = {
    /** GET /admin/product-types */
    getAll: () => api.get<ProductType[]>('/admin/product-types'),

    /** POST /admin/product-types */
    add: (name: string) => api.post<ProductType>('/admin/product-types', { name }),

    /** PUT /admin/product-types/:id */
    update: (id: number, name: string) =>
        api.put<ProductType>(`/admin/product-types/${id}`, { name }),

    /** PATCH /admin/product-types/:id/block */
    block: (id: number) => api.patch<ProductType>(`/admin/product-types/${id}/block`),

    /** PATCH /admin/product-types/:id/unblock */
    unblock: (id: number) => api.patch<ProductType>(`/admin/product-types/${id}/unblock`),
};

export default productTypesService;
