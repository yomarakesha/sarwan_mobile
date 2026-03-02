import { Stock } from '../types/models';
import api from './api';

/**
 * Courier-specific stock endpoint.
 * Returns stocks for the currently logged-in courier's location only.
 * GET /api/courier/stocks
 */
const courierStocksService = {
    getMyStocks: (): Promise<Stock[]> =>
        api.get<Stock[]>('/courier/stocks'),
};

export default courierStocksService;
