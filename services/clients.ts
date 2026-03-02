import { ApiMessage, ClientAddress, ClientPhone } from '../types/models';
import api from './api';

export const clientsService = {
    /** GET /admin/clients (optional ?phone=, ?name=) */
    getAll: (params?: { phone?: string; name?: string }) => {
        const query: Record<string, string> = {};
        if (params?.phone) query.phone = params.phone;
        if (params?.name) query.name = params.name;
        return api.get<{ id: number; full_name: string; price_type_id: number; is_active: boolean; phones: { id: number; phone: string }[] }[]>(
            '/admin/clients',
            Object.keys(query).length > 0 ? query : undefined
        );
    },

    /** POST /admin/clients */
    create: (data: { full_name: string; price_type_id: number }) =>
        api.post<{ message: string; id: number }>('/admin/clients', data),

    /** POST /admin/clients/:id/toggle-active */
    toggleActive: (id: number, data?: { is_active?: boolean; reason?: string }) =>
        api.post<{ message: string; is_active: boolean }>(`/admin/clients/${id}/toggle-active`, data),

    /** PATCH /admin/clients/:id */
    update: (id: number, data: { full_name?: string; price_type_id?: number }) =>
        api.patch<{ message: string }>(`/admin/clients/${id}`, data),

    /** POST /admin/clients/:id/phones */
    addPhone: (id: number, phone: string) =>
        api.post<{ id: number; message: string }>(`/admin/clients/${id}/phones`, { phone }),

    /** GET /admin/clients/:id/phones */
    getPhones: (id: number) =>
        api.get<ClientPhone[]>(`/admin/clients/${id}/phones`),

    /** DELETE /admin/clients/phones/:phone_id */
    removePhone: (phoneId: number) =>
        api.delete<ApiMessage>(`/admin/clients/phones/${phoneId}`),

    /** POST /admin/clients/:id/addresses */
    addAddress: (id: number, data: { city_id: number; district_id: number; address_line: string }) =>
        api.post<{ id: number; message: string }>(`/admin/clients/${id}/addresses`, data),

    /** GET /admin/clients/:id/addresses */
    getAddresses: (id: number) =>
        api.get<ClientAddress[]>(`/admin/clients/${id}/addresses`),

    /** DELETE /admin/clients/addresses/:address_id */
    removeAddress: (addressId: number) =>
        api.delete<ApiMessage>(`/admin/clients/addresses/${addressId}`),
};

export default clientsService;
