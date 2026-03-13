import { Transaction } from '../types/models';
import api from './api';

export interface TransactionFilters {
    start_date?: string;
    end_date?: string;
    user_id?: number;
    operation_type?: string;
    page?: number;
    per_page?: number;
}

export interface PaginatedTransactions {
    transactions: Transaction[];
    page: number;
    per_page: number;
    total: number;
    pages: number;
}

export const warehouseTransactionsService = {
    /** GET /admin/transaction-types
     * We use /admin/transaction-types until warehouse-specific endpoint is available.
     */
    getTypes: () =>
        api.get<Record<string, { code: string; labels: Record<string, string> }>>('/admin/transaction-types'),

    /**
     * GET /warehouse/transactions
     * Все транзакции с фильтрами
     */
    getAll: (filters?: TransactionFilters) => {
        const params: Record<string, string> = {};
        if (filters?.start_date) params.start_date = filters.start_date;
        if (filters?.end_date) params.end_date = filters.end_date;
        if (filters?.user_id !== undefined) params.user_id = String(filters.user_id);
        if (filters?.operation_type) params.operation_type = filters.operation_type;
        if (filters?.page !== undefined) params.page = String(filters.page);
        if (filters?.per_page !== undefined) params.per_page = String(filters.per_page);
        return api.get<PaginatedTransactions>('/warehouse/transactions', Object.keys(params).length > 0 ? params : undefined);
    },

    /**
     * GET /warehouse/transactions_from_counterparties
     * Только приемка с завода (INVENTORY_IN)
     */
    getFromCounterparties: (filters?: Pick<TransactionFilters, 'start_date' | 'end_date' | 'page' | 'per_page'>) => {
        const params: Record<string, string> = {};
        if (filters?.start_date) params.start_date = filters.start_date;
        if (filters?.end_date) params.end_date = filters.end_date;
        if (filters?.page !== undefined) params.page = String(filters.page);
        if (filters?.per_page !== undefined) params.per_page = String(filters.per_page);
        return api.get<PaginatedTransactions>('/warehouse/transactions_from_counterparties', Object.keys(params).length > 0 ? params : undefined);
    },

    /**
     * POST /warehouse/transaction
     * Создать транзакцию (перемещение товара)
     */
    create: (data: {
        from_location_id: number;
        to_location_id: number;
        product_id: number;
        product_state_id: number;
        quantity: number;
        operation_type: string;
        note?: string;
    }) => api.post<Transaction>('/warehouse/transaction', data),

    /**
     * DELETE /warehouse/transaction/:id
     * Отменить транзакцию
     */
    delete: (id: number) =>
        api.delete<{ message: string }>(`/warehouse/transaction/${id}`),
};

export default warehouseTransactionsService;
