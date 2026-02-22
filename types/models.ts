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
