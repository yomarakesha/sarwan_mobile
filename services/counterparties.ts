import { Counterparty } from '../types/models';
import api from './api';

export const counterpartiesService = {
    /** GET /admin/counterparties */
    getAll: () => api.get<Counterparty[]>('/admin/counterparties'),

    /** POST /admin/counterparties */
    add: (data: { name: string; addresses?: string[]; phones?: string[] }) =>
        api.post<Counterparty>('/admin/counterparties', data),

    /** PUT /admin/counterparties/:id */
    update: (id: number, data: { name?: string; addresses?: string[]; phones?: string[] }) =>
        api.put<Counterparty>(`/admin/counterparties/${id}`, data),

    /** PATCH /admin/counterparties/:id/block */
    block: (id: number) => api.patch<Counterparty>(`/admin/counterparties/${id}/block`),

    /** PATCH /admin/counterparties/:id/unblock */
    unblock: (id: number) => api.patch<Counterparty>(`/admin/counterparties/${id}/unblock`),
};

export default counterpartiesService;
