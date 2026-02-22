import { Transport } from '../types/models';
import api from './api';

export const transportsService = {
    /** GET /transports */
    getAll: () => api.get<Transport[]>('/transports'),

    /** POST /transports */
    add: (data: { number: string; capacity: number }) =>
        api.post<Transport>('/transports', data),

    /** PUT /transports/:id */
    update: (id: number, data: { number?: string; capacity?: number }) =>
        api.put<Transport>(`/transports/${id}`, data),

    /** PATCH /transports/:id/block */
    block: (id: number) => api.patch<Transport>(`/transports/${id}/block`),

    /** PATCH /transports/:id/unblock */
    unblock: (id: number) => api.patch<Transport>(`/transports/${id}/unblock`),
};

export default transportsService;
