import { Product } from '../types/models';
import api from './api';

export const productsService = {
    /** GET /admin/products */
    getAll: () => api.get<Product[]>('/admin/products'),

    /** POST /admin/products */
    add: (data: {
        name: string;
        product_type_id: number;
        brand_id: number;
        volume?: number;
        quantity_per_block?: number;
    }) => api.post<Product>('/admin/products', data),

    /** PUT /admin/products/:id */
    update: (id: number, data: {
        name?: string;
        product_type_id?: number;
        brand_id?: number;
        volume?: number;
        quantity_per_block?: number;
    }) => api.put<Product>(`/admin/products/${id}`, data),

    /** PATCH /admin/products/:id/block */
    block: (id: number) => api.patch<Product>(`/admin/products/${id}/block`),

    /** PATCH /admin/products/:id/unblock */
    unblock: (id: number) => api.patch<Product>(`/admin/products/${id}/unblock`),
};

export default productsService;
