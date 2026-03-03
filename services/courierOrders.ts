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
    total: number;
    status: 'waiting' | 'in_transit' | 'delivered' | 'cancelled';
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
    /** GET /api/courier/orders?date=YYYY-MM-DD */
    getByDate: (date: string): Promise<CourierOrder[]> =>
        api.get<CourierOrder[]>(`/courier/orders?date=${date}`),

    /** GET /api/courier/orders/:id */
    getById: (id: number): Promise<CourierOrder> =>
        api.get<CourierOrder>(`/courier/orders/${id}`),

    /** POST /api/courier/orders */
    create: (payload: CreateOrderPayload): Promise<CourierOrder> =>
        api.post<CourierOrder>('/courier/orders', payload),

    /** PATCH /api/courier/orders/:id/status */
    updateStatus: (id: number, status: string): Promise<CourierOrder> =>
        api.patch<CourierOrder>(`/courier/orders/${id}/status`, { status }),

    /** POST /api/courier/orders/:id/notes */
    addNote: (id: number, text: string): Promise<{ message: string }> =>
        api.post<{ message: string }>(`/courier/orders/${id}/notes`, { text }),
};

export default courierOrdersService;
