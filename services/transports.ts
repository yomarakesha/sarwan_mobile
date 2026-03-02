import { Transport } from '../types/models';
import api from './api';

export const transportsService = {
    /** GET /admin/transports */
    getAll: () => api.get<Transport[]>('/admin/transports'),

    /** POST /admin/transports */
    add: (data: { number: string; capacity: number }) =>
        api.post<Transport>('/admin/transports', data),

    /** PUT /admin/transports/:id */
    update: (id: number, data: { number?: string; capacity?: number }) =>
        api.put<Transport>(`/admin/transports/${id}`, data),

    /** PATCH /admin/transports/:id/block */
    block: (id: number) => api.patch<Transport>(`/admin/transports/${id}/block`),

    /** PATCH /admin/transports/:id/unblock */
    unblock: (id: number) => api.patch<Transport>(`/admin/transports/${id}/unblock`),
};

export default transportsService;
