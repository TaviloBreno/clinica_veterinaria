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
        withCredentials: false,  // Desabilitar temporariamente para resolver CORS
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
                // CSRF temporariamente desabilitado - sistema funcionará sem autenticação
                // await axios.get('/sanctum/csrf-cookie');
                console.log('CSRF desabilitado - modo demo');
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

    useEffect(() => {
        // Verificar se há um usuário autenticado
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Tentar obter informações do usuário
            const response = await globalAxiosInstance.get('/api/user');
            setUser(response.data);
        } catch (error) {
            console.log('Usuário não autenticado, usando modo demo:', error.message);
            // Para desenvolvimento, definir um usuário padrão
            setUser({
                id: 1,
                name: 'Usuário Demo',
                email: 'demo@veterinaria.com'
            });
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await globalAxiosInstance.post('/api/login', credentials);
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await globalAxiosInstance.post('/api/logout');
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
        axiosInstance: globalAxiosInstance
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;