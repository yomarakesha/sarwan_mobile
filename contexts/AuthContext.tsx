import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface AuthUser {
    id: number;
    username: string;
    role: string;
    full_name: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    isCheckingSession: boolean;
    user: AuthUser | null;
    username: string | null;
    role: string | null;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: false,
    isCheckingSession: true,
    user: null,
    username: null,
    role: null,
    error: null,
    login: async () => false,
    logout: async () => { },
    clearError: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check existing session on app startup via GET /auth/me
    useEffect(() => {
        const checkSession = async () => {
            try {
                const data = await api.get<{ authenticated: boolean; user: AuthUser }>('/auth/me');
                if (data.authenticated && data.user) {
                    setUser(data.user);
                    setIsAuthenticated(true);
                }
            } catch {
                // No active session — stay unauthenticated
            } finally {
                setIsCheckingSession(false);
            }
        };
        checkSession();
    }, []);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await api.post<{ status: string; user: AuthUser }>('/auth/login', { username, password });
            setUser(data.user);
            setIsAuthenticated(true);
            return true;
        } catch (err: any) {
            const message = err?.message || 'Ошибка входа';
            setError(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await api.post('/auth/logout');
        } catch {
            // Clear local state even if request fails
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                isCheckingSession,
                user,
                username: user?.username ?? null,
                role: user?.role ?? null,
                error,
                login,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
