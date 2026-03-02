import { Stock } from '../types/models';
import api from './api';

export const warehouseStocksService = {
    /**
     * GET /warehouse/stocks
     * Optional ?location_type=warehouse|counterparty|courier
     */
    getAll: (locationFilter?: 'warehouse' | 'counterparty' | 'courier') => {
        const params = locationFilter ? { location_type: locationFilter } : undefined;
        return api.get<Stock[]>('/warehouse/stocks', params);
    },

    /**
     * POST /warehouse/stocks/receive_from_counterparty
     * Приемка товара с завода на склад
     */
    receiveFromCounterparty: (data: {
        from_location_id: number;
        to_location_id: number;
        product_id: number;
        product_state_id: number;
        quantity: number;
        note?: string;
    }) => api.post<{ id: number; operation_type: string; quantity: number }>('/warehouse/stocks/receive_from_counterparty', data),
};

export default warehouseStocksService;
