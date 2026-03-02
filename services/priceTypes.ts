import { PriceType } from '../types/models';
import api from './api';

export const priceTypesService = {
    /** GET /admin/price-types */
    getAll: () => api.get<PriceType[]>('/admin/price-types'),

    /** POST /admin/price-types */
    add: (name: string) => api.post<PriceType>('/admin/price-types', { name }),

    /** PUT /admin/price-types/:id */
    update: (id: number, name: string) =>
        api.put<PriceType>(`/admin/price-types/${id}`, { name }),

    /** PATCH /admin/price-types/:id/block */
    block: (id: number) => api.patch<PriceType>(`/admin/price-types/${id}/block`),

    /** PATCH /admin/price-types/:id/unblock */
    unblock: (id: number) => api.patch<PriceType>(`/admin/price-types/${id}/unblock`),
};

export default priceTypesService;
