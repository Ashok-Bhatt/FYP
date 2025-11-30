import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import { User, AuthResponse } from '../types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    loading: boolean;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'AGENT' | 'PARTNER' | 'ADMIN' | 'USER';
    companyName?: string;
    destinations?: string[];
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo) as User);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const { data } = await axios.post<AuthResponse>(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                { email, password }
            );
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw axiosError.response?.data?.message || 'Login failed';
        }
    };

    const logout = (): void => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const register = async (userData: RegisterData): Promise<AuthResponse> => {
        try {
            const { data } = await axios.post<AuthResponse>(
                `${import.meta.env.VITE_API_URL}/api/auth/signup`,
                userData
            );
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw axiosError.response?.data?.message || 'Registration failed';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
