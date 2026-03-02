import { Transaction } from '../types/models';
import api from './api';

export interface CourierTransaction {
    id: number;
    created_at: string;
    operation_type: string;
    product_name: string | null;
    product_type_name: string | null;
    brand_name: string | null;
    product_state_name: string | null;
    from_location_name: string | null;
    quantity: number;
    note: string | null;
}

export interface CourierTransactionDetail {
    id: number;
    created_at: string;
    operation_type: string;
    quantity: number;
    note: string | null;
    user_id: number | null;
    from_location: { id: number; name: string; type: string } | null;
    to_location: { id: number; name: string; type: string } | null;
    product: {
        id: number;
        name: string;
        type: { id: number; name: string } | null;
        brand: { id: number; name: string } | null;
    } | null;
    product_state: { id: number; name: string } | null;
}

export interface CreateCourierTransactionPayload {
    /** ID of the target courier (receiver) */
    to_user_id: number;
    product_id: number;
    product_state_id: number;
    quantity: number;
    note?: string;
}

/**
 * Courier-specific transaction endpoints.
 * All routes under /api/courier/transactions
 */
const courierTransactionsService = {
    /**
     * GET /api/courier/transactions?date=YYYY-MM-DD
     * Returns the current courier's transactions for the given date.
     */
    getByDate: (date: string): Promise<CourierTransaction[]> =>
        api.get<CourierTransaction[]>(`/courier/transactions?date=${date}`),

    /**
     * GET /api/courier/transactions/:id
     * Returns full details of a single transaction.
     */
    getById: (id: number): Promise<CourierTransactionDetail> =>
        api.get<CourierTransactionDetail>(`/courier/transactions/${id}`),

    /**
     * POST /api/courier/transactions
     * Transfer stock from the current courier to another courier.
     */
    transferToCourier: (payload: CreateCourierTransactionPayload): Promise<Transaction> =>
        api.post<Transaction>('/courier/transactions', payload),
};

export default courierTransactionsService;
