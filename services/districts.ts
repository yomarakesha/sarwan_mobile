import { District } from '../types/models';
import api from './api';

export const districtsService = {
    /** GET /admin/districts  (optional ?city_id=) */
    getAll: (cityId?: number) => {
        const params = cityId ? { city_id: String(cityId) } : undefined;
        return api.get<District[]>('/admin/districts', params);
    },

    /** POST /admin/districts */
    add: (name: string, cityId: number) =>
        api.post<District>('/admin/districts', { name, city_id: cityId }),

    /** PUT /admin/districts/:id */
    update: (id: number, data: { name?: string; city_id?: number }) =>
        api.put<{ message: string; district: District }>(`/admin/districts/${id}`, data),

    /** PATCH /admin/districts/:id/block */
    block: (id: number) =>
        api.patch<{ message: string; district: District }>(`/admin/districts/${id}/block`),

    /** PATCH /admin/districts/:id/unblock */
    unblock: (id: number) =>
        api.patch<{ message: string; district: District }>(`/admin/districts/${id}/unblock`),

    /** GET /admin/districts/stats */
    getStats: () =>
        api.get<Array<{ id: number; district: string; city: string; couriers_count: number; clients_count: number }>>('/admin/districts/stats'),
};

export default districtsService;
