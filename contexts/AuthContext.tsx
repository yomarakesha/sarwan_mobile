import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    username: string | null;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: false,
    username: null,
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
    const [username, setUsername] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (user: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            await api.post('/login', { username: user, password });
            setUsername(user);
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
            await api.post('/logout');
        } catch {
            // Even if logout request fails, clear local state
        } finally {
            setIsAuthenticated(false);
            setUsername(null);
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
                username,
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
