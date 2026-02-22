import { PriceType } from '../types/models';
import api from './api';

export const priceTypesService = {
    /** GET /price-types */
    getAll: () => api.get<PriceType[]>('/price-types'),

    /** POST /price-types */
    add: (name: string) => api.post<PriceType>('/price-types', { name }),

    /** PUT /price-types/:id */
    update: (id: number, name: string) =>
        api.put<PriceType>(`/price-types/${id}`, { name }),

    /** PATCH /price-types/:id/block */
    block: (id: number) => api.patch<PriceType>(`/price-types/${id}/block`),

    /** PATCH /price-types/:id/unblock */
    unblock: (id: number) => api.patch<PriceType>(`/price-types/${id}/unblock`),
};

export default priceTypesService;
