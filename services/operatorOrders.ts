import api from './api';

// -------------------------------------------------------------
// Типы для оператора
// -------------------------------------------------------------

export interface OrderItem {
    service_id: number;
    quantity: number;
}

export interface CreateOrderPayload {
    client_id: number;
    client_address_id: number;
    client_phone_id: number;
    delivery_date: string; // YYYY-MM-DD
    delivery_time_type: 'urgent' | 'during_day' | 'specific_time';
    delivery_time?: string; // HH:MM:SS — только при specific_time
    payment_type: 'cash' | 'card' | 'cash_and_card' | 'credit' | 'free';
    cash_amount?: number;
    card_amount?: number;
    courier_id?: number;
    note?: string;
    items: OrderItem[];
}

export interface CalculateOrderPayload {
    client_id: number;
    client_address_id: number;
    items: OrderItem[];
}

export interface CalculateOrderResult {
    total_order_price: number;
    total_discount_amount: number;
    final_order_price: number;
    order_items_calculated: {
        service_id: number;
        quantity: number;
        price: number | null;
        total_price: number;
    }[];
    applied_discounts: {
        id: number;
        name: string;
        amount: number;
    }[];
}

export interface MonitoringFilters {
    delivery_date?: string; // YYYY-MM-DD
    phone?: string;
    page?: number;
    per_page?: number;
    lang?: 'ru' | 'tm';
}

export interface PaginatedOrders {
    orders: Record<string, unknown>[];
    total: number;
    pages: number;
    current_page: number;
}

export interface CouriersInfoResult {
    date: string;
    couriers: {
        courier_id: number;
        courier_name: string;
        courier_phone: string;
        is_active: boolean;
        transport_number: string | null;
        orders_count: number;
        cities: string | null;
        districts: string | null;
    }[];
}

const operatorOrdersService = {
    /**
     * POST /operator/orders
     * Создание нового заказа оператором
     */
    create: (payload: CreateOrderPayload) =>
        api.post<Record<string, unknown>>('/operator/orders', payload),

    /**
     * POST /operator/orders/calculate
     * Расчёт стоимости заказа без его создания
     */
    calculate: (payload: CalculateOrderPayload) =>
        api.post<CalculateOrderResult>('/operator/orders/calculate', payload),

    /**
     * GET /operator/monitoring
     * Мониторинг всех заказов с фильтрами
     */
    getMonitoring: (filters?: MonitoringFilters) => {
        const params: Record<string, string> = {};
        if (filters?.delivery_date) params.delivery_date = filters.delivery_date;
        if (filters?.phone) params.phone = filters.phone;
        if (filters?.page !== undefined) params.page = String(filters.page);
        if (filters?.per_page !== undefined) params.per_page = String(filters.per_page);
        if (filters?.lang) params.lang = filters.lang;
        return api.get<PaginatedOrders>('/operator/monitoring', Object.keys(params).length > 0 ? params : undefined);
    },

    /**
     * GET /operator/clients/:id/orders
     * История заказов конкретного клиента
     */
    getClientOrders: (clientId: number, filters?: { page?: number; per_page?: number; lang?: 'ru' | 'tm' }) => {
        const params: Record<string, string> = {};
        if (filters?.page !== undefined) params.page = String(filters.page);
        if (filters?.per_page !== undefined) params.per_page = String(filters.per_page);
        if (filters?.lang) params.lang = filters.lang;
        return api.get<PaginatedOrders & { client_id: number; client_name: string }>(
            `/operator/clients/${clientId}/orders`,
            Object.keys(params).length > 0 ? params : undefined
        );
    },

    /**
     * GET /operator/couriers_info?date=YYYY-MM-DD
     * Сводка по всем курьерам на дату (только admin/operator)
     */
    getCouriersInfo: (date?: string) => {
        const params: Record<string, string> = {};
        if (date) params.date = date;
        return api.get<CouriersInfoResult>('/operator/couriers_info', Object.keys(params).length > 0 ? params : undefined);
    },

    /**
     * GET /operator/specific_courier_info/:courier_id?date=YYYY-MM-DD
     * Заказы конкретного курьера на дату
     */
    getCourierInfo: (courierId: number, filters?: { date?: string; page?: number; per_page?: number; lang?: 'ru' | 'tm' }) => {
        const params: Record<string, string> = {};
        if (filters?.date) params.date = filters.date;
        if (filters?.page !== undefined) params.page = String(filters.page);
        if (filters?.per_page !== undefined) params.per_page = String(filters.per_page);
        if (filters?.lang) params.lang = filters.lang;
        return api.get<PaginatedOrders & { courier_id: number; courier_name: string; date: string }>(
            `/operator/specific_courier_info/${courierId}`,
            Object.keys(params).length > 0 ? params : undefined
        );
    },
};

export default operatorOrdersService;
