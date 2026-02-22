/**
 * Sarwan — Mock Data
 * Mirrors the content visible in design screenshots
 */

export interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    timeSlot: string;
    address: string;
    customerName: string;
    phone: string;
    floor: number;
    apartment: string;
    products: Product[];
    emptyBottlesCollected: number;
    status: 'in_transit' | 'waiting' | 'delivered' | 'cancelled';
    paymentCash: number;
    paymentCard: number;
    total: number;
    paymentType: 'cash' | 'card' | 'credit' | 'credit_no_pay' | 'free';
    promoText?: string;
    promoProgress?: string;
    notes: OrderNote[];
}

export interface OrderNote {
    id: string;
    author: string;
    role: string;
    date: string;
    text: string;
}

export interface WarehouseAction {
    id: string;
    time: string;
    status: 'received' | 'transferred';
    person: string;
    items: WarehouseItem[];
    notes?: string;
}

export interface WarehouseItem {
    name: string;
    type: string;
    quantity: number;
}

export interface CashierEntry {
    id: string;
    timeSlot: string;
    address: string;
    products: Product[];
    paymentTypes: string[];
}

export interface UserProfile {
    name: string;
    date: string;
}

// --- User Profile ---
export const userProfile: UserProfile = {
    name: 'Amanow Aman',
    date: '12 Январь, 2026',
};

// --- Orders Stats ---
export const ordersStats = {
    totalOrders: 21,
    completedOrders: 12,
    totalTary: 50,
    collectedTary: 12,
};

// --- Warehouse Stats ---
export const warehouseStats = {
    totalTaryInCar: 80,
    full: 40,
    empty: 40,
};

// --- Cashier Stats ---
export const cashierStats = {
    total: 125,
    cash: 75,
    card: 50,
};

// --- Orders ---
export const orders: Order[] = [
    {
        id: '1',
        orderNumber: '12486',
        timeSlot: '09:00 - 11:00',
        address: '10 мкр., 28 дом, 1й подъезд, 2й этаж',
        customerName: 'Muradow Mekan',
        phone: '+993 62 00-11-22-33',
        floor: 2,
        apartment: '47 кв',
        products: [
            { id: 'p1', name: 'Вода 19л', quantity: 2, price: 30 },
            { id: 'p2', name: 'Замена Arçalyk', quantity: 2, price: 50 },
        ],
        emptyBottlesCollected: 2,
        status: 'waiting',
        paymentCash: 20,
        paymentCard: 10,
        total: 30,
        paymentType: 'cash',
        promoText: 'Первые 10 заказов 10 м',
        promoProgress: '3/10 заказа',
        notes: [
            {
                id: 'n1',
                author: 'Amanow Aman',
                role: 'Оператор',
                date: '15 Сент. 2025, 11:04',
                text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et masLorem ipsum dolor sit amet consectetur adipiscing elit Ut et m',
            },
        ],
    },
    {
        id: '2',
        orderNumber: '12487',
        timeSlot: '09:00 - 11:00',
        address: '10 мкр., 28 дом, 1й подъезд, 2й этаж',
        customerName: 'Geldiyew Serdar',
        phone: '+993 65 12-34-56-78',
        floor: 3,
        apartment: '12 кв',
        products: [
            { id: 'p3', name: 'Вода 19л', quantity: 2, price: 30 },
        ],
        emptyBottlesCollected: 1,
        status: 'in_transit',
        paymentCash: 30,
        paymentCard: 0,
        total: 30,
        paymentType: 'cash',
        notes: [],
    },
    {
        id: '3',
        orderNumber: '12488',
        timeSlot: '09:00 - 11:00',
        address: '10 мкр., 28 дом, 1й подъезд, 2й этаж',
        customerName: 'Atayew Begench',
        phone: '+993 63 98-76-54-32',
        floor: 5,
        apartment: '55 кв',
        products: [
            { id: 'p4', name: 'Вода 19л', quantity: 2, price: 30 },
            { id: 'p5', name: 'Замена Arçalyk', quantity: 2, price: 50 },
        ],
        emptyBottlesCollected: 3,
        status: 'in_transit',
        paymentCash: 0,
        paymentCard: 80,
        total: 80,
        paymentType: 'card',
        notes: [],
    },
    {
        id: '4',
        orderNumber: '12489',
        timeSlot: '11:00 - 13:00',
        address: '5 мкр., 15 дом, 3й подъезд, 4й этаж',
        customerName: 'Orazow Maksat',
        phone: '+993 61 55-66-77-88',
        floor: 4,
        apartment: '33 кв',
        products: [
            { id: 'p6', name: 'Вода 19л', quantity: 3, price: 30 },
            { id: 'p7', name: 'Замена Arçalyk', quantity: 1, price: 50 },
        ],
        emptyBottlesCollected: 2,
        status: 'delivered',
        paymentCash: 30,
        paymentCard: 0,
        total: 140,
        paymentType: 'cash',
        promoText: 'Первые 10 заказов Скидка 5%',
        promoProgress: '3/10 заказа',
        notes: [],
    },
    {
        id: '5',
        orderNumber: '12490',
        timeSlot: '13:00 - 15:00',
        address: '3 мкр., 7 дом, 2й подъезд, 1й этаж',
        customerName: 'Berdimuradow Kemal',
        phone: '+993 64 11-22-33-44',
        floor: 1,
        apartment: '5 кв',
        products: [
            { id: 'p8', name: 'Вода 20л', quantity: 2, price: 35 },
        ],
        emptyBottlesCollected: 2,
        status: 'waiting',
        paymentCash: 0,
        paymentCard: 0,
        total: 0,
        paymentType: 'free',
        promoText: '5й заказ бесплатно',
        notes: [],
    },
];

// --- Warehouse Actions ---
export const warehouseActions: WarehouseAction[] = [
    {
        id: 'w1',
        time: '17:03',
        status: 'received',
        person: 'Amanow Wepa',
        items: [
            { name: 'Вода 19л (Полные)', type: 'full', quantity: 100 },
            { name: 'Вода 19л (Пустые)', type: 'empty', quantity: 100 },
        ],
        notes: 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et masLorem ipsum dolor sit amet consectetur adipiscing elit Ut et m',
    },
    {
        id: 'w2',
        time: '17:03',
        status: 'transferred',
        person: 'Amanow Wepa',
        items: [
            { name: 'Вода 19л (Полные)', type: 'full', quantity: 100 },
        ],
    },
    {
        id: 'w3',
        time: '17:03',
        status: 'received',
        person: 'Amanow Wepa',
        items: [
            { name: 'Вода 19л (Пустые)', type: 'empty', quantity: 100 },
        ],
    },
    {
        id: 'w4',
        time: '17:03',
        status: 'transferred',
        person: 'Amanow Wepa',
        items: [
            { name: 'Вода 19л (Полные)', type: 'full', quantity: 100 },
            { name: 'Вода 19л (Пустые)', type: 'empty', quantity: 100 },
        ],
    },
    {
        id: 'w5',
        time: '17:03',
        status: 'received',
        person: 'Amanow Wepa',
        items: [
            { name: 'Вода 19л (Пустые)', type: 'empty', quantity: 100 },
            { name: 'Вода 19л (Полные)', type: 'full', quantity: 100 },
        ],
    },
];

// --- Cashier Entries ---
export const cashierEntries: CashierEntry[] = [
    {
        id: 'c1',
        timeSlot: '09:00 - 11:00',
        address: '10 мкр, 28 дом, 1й подъезд, 2й этаж',
        products: [
            { id: 'cp1', name: 'Вода 19л', quantity: 2, price: 30 },
            { id: 'cp2', name: 'Замена Arçalyk', quantity: 2, price: 50 },
        ],
        paymentTypes: ['карта', 'наличные'],
    },
    {
        id: 'c2',
        timeSlot: '09:00 - 11:00',
        address: '10 мкр, 28 дом, 1й подъезд, 2й этаж',
        products: [
            { id: 'cp3', name: 'Вода 19л', quantity: 2, price: 30 },
            { id: 'cp4', name: 'Замена Arçalyk', quantity: 2, price: 50 },
        ],
        paymentTypes: ['наличные'],
    },
    {
        id: 'c3',
        timeSlot: '09:00 - 11:00',
        address: '10 мкр, 28 дом, 1й подъезд, 2й этаж',
        products: [
            { id: 'cp5', name: 'Вода 19л', quantity: 2, price: 30 },
            { id: 'cp6', name: 'Замена Arçalyk', quantity: 2, price: 50 },
        ],
        paymentTypes: ['наличные'],
    },
    {
        id: 'c4',
        timeSlot: '09:00 - 11:00',
        address: '10 мкр, 28 дом, 1й подъезд, 2й этаж',
        products: [
            { id: 'cp7', name: 'Вода 19л', quantity: 2, price: 30 },
            { id: 'cp8', name: 'Замена Arçalyk', quantity: 2, price: 50 },
        ],
        paymentTypes: ['кредит', 'наличные'],
    },
    {
        id: 'c5',
        timeSlot: '09:00 - 11:00',
        address: '10 мкр, 28 дом, 1й подъезд, 2й этаж',
        products: [
            { id: 'cp9', name: 'Вода 19л', quantity: 2, price: 30 },
            { id: 'cp10', name: 'Замена Arçalyk', quantity: 2, price: 50 },
        ],
        paymentTypes: ['кредит', 'карта'],
    },
];

// --- Product options for dropdowns ---
export const productOptions = [
    'Вода 19л',
    'Вода 20л',
    'Замена Arçalyk',
    'Замена Sarwan',
];

// --- Tary type options ---
export const taryTypeOptions = ['Полные', 'Пустые'];

// --- Tary brand options ---
export const taryBrandOptions = ['Sarwan', 'Arçalyk', 'Haýat'];

// --- Status options ---
export const statusOptions = [
    { key: 'in_transit', label: 'В пути', color: '#2563EB' },
    { key: 'waiting', label: 'В ожидании', color: '#F59E0B' },
    { key: 'delivered', label: 'Доставлено', color: '#16A34A' },
    { key: 'cancelled', label: 'Отменено', color: '#DC2626' },
];

// --- Warehouse action status options ---
export const warehouseStatusOptions = [
    { key: 'received', label: 'Принято' },
    { key: 'transferred', label: 'Передано' },
];

// --- Person options for warehouse ---
export const warehousePersonOptions = [
    'Amanow Wepa',
    'Geldiyew Merdan',
    'Orazow Batyr',
];
