import { District } from '../types/models';
import api from './api';

export const districtsService = {
    /** GET /districts  (optional ?city_id=) */
    getAll: (cityId?: number) => {
        const params = cityId ? { city_id: String(cityId) } : undefined;
        return api.get<District[]>('/districts', params);
    },

    /** POST /districts */
    add: (name: string, cityId: number) =>
        api.post<District>('/districts', { name, city_id: cityId }),

    /** PUT /districts/:id */
    update: (id: number, data: { name?: string; city_id?: number }) =>
        api.put<{ message: string; district: District }>(`/districts/${id}`, data),

    /** PATCH /districts/:id/block */
    block: (id: number) =>
        api.patch<{ message: string; district: District }>(`/districts/${id}/block`),

    /** PATCH /districts/:id/unblock */
    unblock: (id: number) =>
        api.patch<{ message: string; district: District }>(`/districts/${id}/unblock`),
};

export default districtsService;
