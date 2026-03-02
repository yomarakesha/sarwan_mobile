import api from './api';

export interface ClientSearchResult {
    id: number;
    full_name: string;
    phone: string;
}

/**
 * Operator-specific client endpoints.
 * GET /api/operator/clients/search?phone=...
 */
const operatorClientsService = {
    searchByPhone: (phone: string): Promise<ClientSearchResult[]> =>
        api.get<ClientSearchResult[]>(`/operator/clients/search?phone=${encodeURIComponent(phone)}`),
};

export default operatorClientsService;
