import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Configurar o axios com defaults - criar instância global para garantir disponibilidade
const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: '/',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    // Interceptor para adicionar token CSRF
    instance.interceptors.request.use(async (config) => {
        // Verificar se é uma requisição que modifica dados
        if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
            try {
                // Obter CSRF token
                await axios.get('/sanctum/csrf-cookie');
            } catch (error) {
                console.warn('Não foi possível obter CSRF token:', error.message);
            }
        }
        return config;
    });

    return instance;
};

// Instância global do axios disponível imediatamente
const globalAxiosInstance = createAxiosInstance();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [axiosInstance] = useState(() => globalAxiosInstance); // Garantir que sempre existe

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Primeiro tentar obter o token CSRF
            await axios.get('/sanctum/csrf-cookie');

            // Tentar obter informações do usuário
            const response = await axiosInstance.get('/api/user');
            setUser(response.data);
        } catch (error) {
            console.log('Usuário não autenticado, usando modo demo:', error.message);
            // Fallback para usuário demo
            setUser({
                id: 1,
                name: 'Usuário Demo',
                email: 'demo@veterinaria.com',
                is_demo: true
            });
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Obter CSRF token
            await axios.get('/sanctum/csrf-cookie');

            // Tentar fazer login
            await axiosInstance.post('/login', { email, password });

            // Se o login for bem-sucedido, obter informações do usuário
            const response = await axiosInstance.get('/api/user');
            setUser(response.data);

            return { success: true };
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao fazer login'
            };
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/logout');
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        logout,
        loading,
        axiosInstance
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
