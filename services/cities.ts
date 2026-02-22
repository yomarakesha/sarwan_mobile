import { City } from '../types/models';
import api from './api';

export const citiesService = {
    /** GET /cities */
    getAll: () => api.get<City[]>('/cities'),

    /** POST /cities */
    add: (name: string) => api.post<City>('/cities', { name }),

    /** PUT /cities/:id */
    update: (id: number, name: string) =>
        api.put<{ message: string; city: City }>(`/cities/${id}`, { name }),

    /** PATCH /cities/:id/block */
    block: (id: number) =>
        api.patch<{ message: string; city: City }>(`/cities/${id}/block`),

    /** PATCH /cities/:id/unblock */
    unblock: (id: number) =>
        api.patch<{ message: string; city: City }>(`/cities/${id}/unblock`),
};

export default citiesService;
