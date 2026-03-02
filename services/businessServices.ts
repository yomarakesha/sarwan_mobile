import { ApiMessage, BusinessService } from '../types/models';
import api from './api';

export const businessServicesApi = {
    /** GET /admin/services (optional ?city_id=, ?is_active=) */
    getAll: (params?: { city_id?: number; is_active?: boolean }) => {
        const query: Record<string, string> = {};
        if (params?.city_id !== undefined) query.city_id = String(params.city_id);
        if (params?.is_active !== undefined) query.is_active = String(params.is_active);
        return api.get<BusinessService[]>('/admin/services', Object.keys(query).length > 0 ? query : undefined);
    },

    /** POST /admin/services */
    add: (data: {
        name: string;
        is_active?: boolean;
        logistic_info?: {
            bottle_out?: number;
            bottle_in?: number;
            water_out?: boolean;
            water_in?: boolean;
        };
    }) => api.post<{ message: string; id: number }>('/admin/services', data),

    /** PUT /admin/services/:id */
    update: (id: number, data: {
        name?: string;
        logistic_info?: {
            bottle_out?: number;
            bottle_in?: number;
            water_out?: boolean;
            water_in?: boolean;
        };
    }) => api.put<ApiMessage>(`/admin/services/${id}`, data),

    /** PATCH /admin/services/:id/toggle */
    toggle: (id: number) =>
        api.patch<{ message: string; is_active: boolean }>(`/admin/services/${id}/toggle`),

    /** POST /admin/services/prices */
    addOrUpdatePrice: (data: {
        service_id: number;
        city_id: number;
        price_type_id: number;
        price: number;
    }) => api.post<ApiMessage>('/admin/services/prices', data),

    /** DELETE /admin/services/prices/:id */
    deletePrice: (priceId: number) =>
        api.delete<ApiMessage>(`/admin/services/prices/${priceId}`),
};

export default businessServicesApi;
