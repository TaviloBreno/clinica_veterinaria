import axios from 'axios';

// Criar uma instância do axios para a API
const api = axios.create({
    baseURL: 'http://localhost:8000',  // Servidor Laravel
    withCredentials: false,  // Desabilitar temporariamente para resolver CORS
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Interceptor para adicionar token CSRF automaticamente
api.interceptors.request.use(
    async (config) => {
        // Se for uma requisição que precisa de CSRF token
        if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
            try {
                // Obter token CSRF se necessário
                await axios.get('/sanctum/csrf-cookie');
            } catch (error) {
                console.log('Aviso: Não foi possível obter CSRF token:', error.message);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Se não autorizado, apenas logar (não redirecionar automaticamente)
            console.log('Usuário não autorizado para esta ação');
        } else if (error.response?.status === 419) {
            // Token CSRF expirado
            console.log('Token CSRF expirado, recarregue a página');
        } else if (error.response?.status >= 500) {
            console.error('Erro interno do servidor:', error.response.status);
        }
        return Promise.reject(error);
    }
);

export { api };
