/**
 * TypeScript types matching backend models
 */

// --- City ---
export interface City {
    id: number;
    name: string;
    is_active: boolean;
}

// --- District ---
export interface District {
    id: number;
    name: string;
    is_active: boolean;
    city_id: number;
    city_name: string | null;
}

// --- User ---
export interface User {
    id: number;
    full_name: string;
    phone: string;
    username: string;
    role: string;
    is_active: boolean;
}

export interface CreateUserData {
    full_name: string;
    phone: string;
    username: string;
    password: string;
    role: string;
}

export interface UpdateUserData {
    full_name?: string;
    phone?: string;
    username?: string;
    password?: string;
    role?: string;
}

// --- Transport ---
export interface Transport {
    id: number;
    number: string;
    capacity: number;
    is_active: boolean;
}

// --- PriceType ---
export interface PriceType {
    id: number;
    name: string;
    is_active: boolean;
}

// --- CourierProfile ---
export interface CourierProfile {
    user_id: number;
    transport_number: string | null;
    device_info: string | null;
    districts: number[];
}

// --- Courier Full Data (from /couriers/full-list) ---
export interface CourierFullData {
    id: number;
    username: string;
    full_name: string;
    phone: string;
    is_active: boolean;
    cities: string[];
    districts: { id: number; name: string }[];
    transport_number: string;
    device_info: string;
}

// --- Auth ---
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface ApiError {
    error: string;
}

export interface ApiMessage {
    message: string;
}

// --- Client ---
export interface Client {
    id: number;
    full_name: string;
    price_type_id: number;
    is_active: boolean;
}

export interface ClientPhone {
    id: number;
    phone: string;
}

export interface ClientAddress {
    id: number;
    city_id: number;
    city_name: string;
    district_id: number;
    district_name: string;
    address_line: string;
}

// --- Service ---
export interface BusinessService {
    id: number;
    name: string;
    is_active: boolean;
    logistic_info?: {
        bottle_out?: number;
        bottle_in?: number;
        water_out?: boolean;
        water_in?: boolean;
    };
    prices?: Array<{
        id: number;
        city_id: number;
        city_name: string;
        price_type_id: number;
        price_type_name: string;
        price: number;
    }>;
}

export interface ServicePrice {
    id: number;
    service_id: number;
    city_id: number;
    price_type_id: number;
    price: number;
}

// --- Brand ---
export interface Brand {
    id: number;
    name: string;
    is_active: boolean;
}

// --- Counterparty ---
export interface CounterpartyAddress {
    id: number;
    address_line: string;
}

export interface CounterpartyPhone {
    id: number;
    phone: string;
}

export interface Counterparty {
    id: number;
    name: string;
    is_active: boolean;
    addresses: CounterpartyAddress[];
    phones: CounterpartyPhone[];
}

// --- ProductType ---
export interface ProductType {
    id: number;
    name: string;
    is_active: boolean;
}

// --- ProductState ---
export interface ProductState {
    id: number;
    name: string;
    is_active: boolean;
}

// --- Product ---
export interface Product {
    id: number;
    name: string;
    product_type_id: number;
    product_type_name?: string;
    brand_id: number;
    brand_name?: string;
    volume?: number;
    quantity_per_block?: number;
    is_active: boolean;
}

// --- Warehouse (admin model) ---
export interface WarehouseAddress {
    id: number;
    address_line: string;
}

export interface WarehousePhone {
    id: number;
    phone: string;
}

export interface Warehouse {
    id: number;
    name: string;
    is_active: boolean;
    addresses: WarehouseAddress[];
    phones: WarehousePhone[];
}

// --- Location (warehouse module) ---
export interface Location {
    id: number;
    name: string;
}

// --- Stock ---
export interface Stock {
    location_name: string;
    product_name: string;
    product_type_name: string;
    brand_name: string;
    product_state_name: string;
    quantity: number;
}

// --- Transaction ---
export interface Transaction {
    id: number;
    created_at: string;
    operation_type: string;
    from_location_id: number;
    from_location_name: string | null;
    to_location_id: number;
    to_location_name: string | null;
    product_id: number;
    product_name: string | null;
    product_state_id: number;
    product_state_name: string | null;
    quantity: number;
    user_id: number | null;
    user_name: string | null;
    note: string | null;
}
