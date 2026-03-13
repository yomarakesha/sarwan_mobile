import api from './api';

export interface CourierOrderItem {
    id: number;
    service_id: number | null;
    service_name: string;
    quantity: number;
    price: number;
}

export interface CourierOrder {
    id: number;
    created_at: string;
    courier_id: number;
    client_id: number | null;
    client_name: string;
    client_phone: string;
    city_id: number | null;
    city_name: string | null;
    district_id: number | null;
    district_name: string | null;
    address_line: string | null;
    empty_bottles_collected: number;
    payment_cash: number;
    payment_card: number;
    payment_credit: number;
    total: number;
    status: 'pending' | 'in_progress' | 'delivered' | 'cancelled';
    note: string | null;
    items: CourierOrderItem[];
}

export interface CreateOrderPayload {
    client_id?: number | null;
    client_name: string;
    client_phone: string;
    city_id?: number | null;
    district_id?: number | null;
    address_line?: string;
    empty_bottles_collected?: number;
    payment_cash?: number;
    payment_card?: number;
    payment_credit?: number;
    note?: string;
    items: {
        service_id: number;
        service_name: string;
        quantity: number;
        price: number;
    }[];
}

/** Returns today's date in YYYY-MM-DD */
export function todayStr(): string {
    return new Date().toISOString().split('T')[0];
}

const courierOrdersService = {
    /** GET /api/courier/orders/summary — сводка (total/completed) на сегодня */
    getSummary: (): Promise<{ date: string; total_orders: number; completed_orders: number }> =>
        api.get('/courier/orders/summary'),

    /** GET /api/courier/inventory — тара курьера (current_tare, issued_today) */
    getInventory: (): Promise<{ date: string; current_tare: number; issued_today: number }> =>
        api.get('/courier/inventory'),

    /** GET /api/courier/orders?date=YYYY-MM-DD */
    getByDate: (date: string): Promise<CourierOrder[]> =>
        api.get<CourierOrder[]>(`/courier/orders?date=${date}`),

    /** GET /api/courier/orders/:id */
    getById: (id: number): Promise<CourierOrder> =>
        api.get<CourierOrder>(`/courier/orders/${id}`),

    /** POST /api/courier/orders */
    create: (payload: CreateOrderPayload): Promise<CourierOrder> =>
        api.post<CourierOrder>('/courier/orders', payload),

    /** PUT /api/courier/orders/:id/status — бэк ожидает PUT, не PATCH */
    updateStatus: (id: number, status: string): Promise<{ message: string; order_id: number; old_status: string; new_status: string }> =>
        api.put(`/courier/orders/${id}/status`, { status }),

    /** POST /api/courier/orders/:id/notes — поле должно быть 'note', не 'text' */
    addNote: (id: number, note: string): Promise<{ message: string; order_id: number; note: string }> =>
        api.post(`/courier/orders/${id}/notes`, { note }),

    /** GET /api/courier/orders/:id/notes */
    getNotes: (id: number): Promise<{ order_id: number; notes: string }> =>
        api.get(`/courier/orders/${id}/notes`),

    /** POST /api/courier/orders/:id/deliver */
    deliverOrder: (id: number, payload: { payment_type?: string; cash_amount?: number; card_amount?: number }): Promise<any> =>
        api.post(`/courier/orders/${id}/deliver`, payload),

    /** GET /api/courier/payments/daily */
    getDailyPayments: (date?: string): Promise<any> => {
        const params: Record<string, string> = {};
        if (date) params.date = date;
        return api.get('/courier/payments/daily', Object.keys(params).length > 0 ? params : undefined);
    },

    /** GET /api/courier/payments/summary */
    getPaymentsSummary: (date?: string): Promise<any> => {
        const params: Record<string, string> = {};
        if (date) params.date = date;
        return api.get('/courier/payments/summary', Object.keys(params).length > 0 ? params : undefined);
    },
};

export default courierOrdersService;
