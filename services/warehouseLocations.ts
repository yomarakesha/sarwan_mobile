import { Location } from '../types/models';
import api from './api';

export const warehouseLocationsService = {
    /** GET /warehouse/locations/counterparties */
    getCounterparties: () => api.get<Location[]>('/warehouse/locations/counterparties'),

    /** GET /warehouse/locations/warehouses */
    getWarehouses: () => api.get<Location[]>('/warehouse/locations/warehouses'),

    /** GET /warehouse/locations/couriers */
    getCouriers: () => api.get<Location[]>('/warehouse/locations/couriers'),
};

export default warehouseLocationsService;
