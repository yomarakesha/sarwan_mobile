import { CourierFullData, CourierProfile } from '../types/models';
import api from './api';

interface CourierFilters {
    active?: boolean;
    city_id?: number;
    district_id?: number;
}

export const couriersService = {
    /** GET /couriers/full-list (optional filters) */
    getFullList: (filters?: CourierFilters) => {
        const params: Record<string, string> = {};
        if (filters?.active !== undefined) params.active = String(filters.active);
        if (filters?.city_id) params.city_id = String(filters.city_id);
        if (filters?.district_id) params.district_id = String(filters.district_id);

        return api.get<CourierFullData[]>(
            '/couriers/full-list',
            Object.keys(params).length > 0 ? params : undefined
        );
    },

    /** PUT /users/:id/equipment */
    updateEquipment: (
        userId: number,
        data: { transport_number?: string | null; device_info?: string }
    ) =>
        api.put<{ message: string; profile: CourierProfile }>(
            `/users/${userId}/equipment`,
            data
        ),

    /** POST /users/:id/districts/attach */
    attachDistricts: (
        userId: number,
        data: { city_id?: number; district_ids: number[] | 'all'; all_districts?: boolean }
    ) =>
        api.post<{ message: string; current_districts: number[] }>(
            `/users/${userId}/districts/attach`,
            data
        ),

    /** DELETE /users/:id/districts/:districtId */
    detachDistrict: (userId: number, districtId: number) =>
        api.delete<{ message: string }>(
            `/users/${userId}/districts/${districtId}`
        ),
};

export default couriersService;
