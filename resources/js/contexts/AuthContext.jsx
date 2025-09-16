import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

// Configurar axios instance
const axiosInstance = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar se há uma sessão ativa ao carregar
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Primeiro tenta obter o token CSRF se necessário
            try {
                await axiosInstance.get('/sanctum/csrf-cookie');
            } catch (csrfError) {
                // Se falhar ao obter CSRF, continua mesmo assim
                console.log('Aviso: não foi possível obter CSRF token');
            }

            // Depois verifica se o usuário está autenticado
            const response = await axiosInstance.get('/api/user');
            if (response.data) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            // Se der erro 401 ou qualquer outro, considera não autenticado
            if (error.response?.status === 401) {
                console.log('Usuário não está autenticado');
            } else if (error.response?.status === 419) {
                console.log('Token CSRF expirado');
            } else {
                console.log('Erro ao verificar autenticação:', error.message);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Primeiro, obter o token CSRF
            await axiosInstance.get('/sanctum/csrf-cookie');

            // Depois, fazer o login
            const response = await axiosInstance.post('/api/login', {
                email,
                password
            });

            if (response.data.user) {
                setUser(response.data.user);
                return { success: true };
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Erro no login'
                };
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Erro de conexão. Tente novamente.'
            };
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/api/logout');
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

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
