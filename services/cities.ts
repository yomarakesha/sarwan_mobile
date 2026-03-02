import { City } from '../types/models';
import api from './api';

export const citiesService = {
    /** GET /admin/cities */
    getAll: () => api.get<City[]>('/admin/cities'),

    /** POST /admin/cities */
    add: (name: string) => api.post<City>('/admin/cities', { name }),

    /** PUT /admin/cities/:id */
    update: (id: number, name: string) =>
        api.put<{ message: string; city: City }>(`/admin/cities/${id}`, { name }),

    /** PATCH /admin/cities/:id/block */
    block: (id: number) =>
        api.patch<{ message: string; city: City }>(`/admin/cities/${id}/block`),

    /** PATCH /admin/cities/:id/unblock */
    unblock: (id: number) =>
        api.patch<{ message: string; city: City }>(`/admin/cities/${id}/unblock`),

    /** GET /admin/cities/full-list */
    getFullList: () =>
        api.get<Array<City & { districts_count: number; couriers_count: number }>>('/admin/cities/full-list'),
};

export default citiesService;
