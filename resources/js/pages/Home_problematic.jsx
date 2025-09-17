import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export default function Home({ onNavigateToClientes, onNavigateToAnimais, onNavigateToVeterinarios, onNavigateToConsultas, onNavigateToReports, onNavigate }) {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total_clientes: 0,
        total_animais: 0,
        total_veterinarios: 0,
        total_consultas: 0,
        consultas_mes_atual: 0,
        receita_mes_atual: 0,
        consultas_pendentes: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Sempre tentar carregar os dados, independente do usuário
        fetchStats();
        fetchRecentActivity();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            // Use the api instance instead of axiosInstance from context
            const response = await api.get('/api/reports');
            if (response.data.overview) {
                setStats(response.data.overview);
            } else {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            // Fallback to individual API calls if reports API fails
            try {
                const [clientesRes, animaisRes, veterinariosRes, consultasRes] = await Promise.all([
                    api.get('/api/clientes'),
                    api.get('/api/animais'),
                    api.get('/api/veterinarios'),
                    api.get('/api/consultas')
                ]);

                setStats({
                    total_clientes: clientesRes.data.length,
                    total_animais: animaisRes.data.length,
                    total_veterinarios: veterinariosRes.data.length,
                    total_consultas: consultasRes.data.length,
                    consultas_mes_atual: 0,
                    receita_mes_atual: 0,
                    consultas_pendentes: 0
                });
            } catch (fallbackError) {
                console.error('Erro ao carregar dados:', fallbackError);
                // Se tudo falhar, manter valores padrão
                setStats({
                    total_clientes: 0,
                    total_animais: 0,
                    total_veterinarios: 0,
                    total_consultas: 0,
                    consultas_mes_atual: 0,
                    receita_mes_atual: 0,
                    consultas_pendentes: 0
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            // Buscar últimas consultas para atividade recente
            const response = await api.get('/api/consultas');
            const consultas = response.data.slice(0, 5); // Últimas 5 consultas
            setRecentActivity(consultas);
        } catch (error) {
            console.error('Erro ao carregar atividades recentes:', error);
            // Se erro de autenticação, definir array vazio
            if (error.response?.status === 401) {
                setRecentActivity([]);
            }
        }
    };

    const getCurrentGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('pt-BR').format(value || 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const quickActions = [
        {
            title: 'Gerenciar Clientes',
            description: 'Ver e gerenciar clientes',
            icon: '👥',
            action: onNavigateToClientes,
            color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
        },
        {
            title: 'Gerenciar Animais',
            description: 'Ver e gerenciar animais',
            icon: '🐕',
            action: onNavigateToAnimais,
            color: 'bg-green-50 hover:bg-green-100 border-green-200'
        },
        {
            title: 'Gerenciar Veterinários',
            description: 'Ver e gerenciar veterinários',
            icon: '👨‍⚕️',
            action: onNavigateToVeterinarios,
            color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
        },
        {
            title: 'Gerenciar Consultas',
            description: 'Ver e gerenciar consultas',
            icon: '📅',
            action: onNavigateToConsultas,
            color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
        },
        {
            title: 'Relatórios',
            description: 'Ver relatórios do sistema',
            icon: '📊',
            action: () => alert('Funcionalidade em desenvolvimento'),
            color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Cabeçalho de boas-vindas */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {getCurrentGreeting()}, {user?.name}! 👋
                            </h1>
                            <p className="text-blue-100 mt-1">
                                Bem-vindo ao Sistema de Gestão Veterinária
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100 text-sm">
                                {new Date().toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cards de estatísticas principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de Clientes
                            </CardTitle>
                            <span className="text-2xl">👥</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? '...' : formatNumber(stats.total_clientes)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Clientes cadastrados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de Animais
                            </CardTitle>
                            <span className="text-2xl">🐕</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? '...' : formatNumber(stats.total_animais)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pets cadastrados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Consultas do Mês
                            </CardTitle>
                            <span className="text-2xl">📅</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loading ? '...' : formatNumber(stats.consultas_mes_atual)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                No mês atual
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Receita do Mês
                            </CardTitle>
                            <span className="text-2xl">💰</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {loading ? '...' : formatCurrency(stats.receita_mes_atual)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Receita atual
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Cards de estatísticas secundárias */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Veterinários
                            </CardTitle>
                            <span className="text-xl">👨‍⚕️</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {loading ? '...' : formatNumber(stats.total_veterinarios)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Profissionais ativos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de Consultas
                            </CardTitle>
                            <span className="text-xl">📊</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">
                                {loading ? '...' : formatNumber(stats.total_consultas)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Consultas realizadas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Consultas Pendentes
                            </CardTitle>
                            <span className="text-xl">⏰</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-orange-600">
                                {loading ? '...' : formatNumber(stats.consultas_pendentes)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Agendadas
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Ações rápidas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações Rápidas</CardTitle>
                            <CardDescription>
                                Acesse rapidamente as funcionalidades principais
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={onNavigateToClientes}
                                    className="p-4 rounded-lg border-2 text-left transition-colors bg-blue-50 hover:bg-blue-100 border-blue-200"
                                >
                                    <div className="text-2xl mb-2">👥</div>
                                    <div className="font-medium text-sm">Clientes</div>
                                    <div className="text-xs text-gray-600">Gerenciar clientes</div>
                                </button>

                                <button
                                    onClick={onNavigateToAnimais}
                                    className="p-4 rounded-lg border-2 text-left transition-colors bg-green-50 hover:bg-green-100 border-green-200"
                                >
                                    <div className="text-2xl mb-2">🐕</div>
                                    <div className="font-medium text-sm">Animais</div>
                                    <div className="text-xs text-gray-600">Gerenciar pets</div>
                                </button>

                                <button
                                    onClick={onNavigateToVeterinarios}
                                    className="p-4 rounded-lg border-2 text-left transition-colors bg-purple-50 hover:bg-purple-100 border-purple-200"
                                >
                                    <div className="text-2xl mb-2">👨‍⚕️</div>
                                    <div className="font-medium text-sm">Veterinários</div>
                                    <div className="text-xs text-gray-600">Equipe médica</div>
                                </button>

                                <button
                                    onClick={onNavigateToConsultas}
                                    className="p-4 rounded-lg border-2 text-left transition-colors bg-orange-50 hover:bg-orange-100 border-orange-200"
                                >
                                    <div className="text-2xl mb-2">📅</div>
                                    <div className="font-medium text-sm">Consultas</div>
                                    <div className="text-xs text-gray-600">Agendar consultas</div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Links para relatórios */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Relatórios</CardTitle>
                            <CardDescription>
                                Análises e estatísticas do sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <button
                                    onClick={onNavigateToReports}
                                    className="w-full p-4 rounded-lg border-2 text-left transition-colors bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">📊</div>
                                        <div>
                                            <div className="font-medium text-sm">Dashboard de Relatórios</div>
                                            <div className="text-xs text-gray-600">Visão geral completa</div>
                                        </div>
                                    </div>
                                </button>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => onNavigate('reports')}
                                        className="p-3 rounded-lg border text-center transition-colors bg-gray-50 hover:bg-gray-100 border-gray-200"
                                    >
                                        <div className="text-lg mb-1">👥</div>
                                        <div className="text-xs font-medium">Clientes</div>
                                    </button>

                                    <button
                                        onClick={() => onNavigate('reports')}
                                        className="p-3 rounded-lg border text-center transition-colors bg-gray-50 hover:bg-gray-100 border-gray-200"
                                    >
                                        <div className="text-lg mb-1">🐕</div>
                                        <div className="text-xs font-medium">Pets</div>
                                    </button>

                                    <button
                                        onClick={() => onNavigate('reports')}
                                        className="p-3 rounded-lg border text-center transition-colors bg-gray-50 hover:bg-gray-100 border-gray-200"
                                    >
                                        <div className="text-lg mb-1">📅</div>
                                        <div className="text-xs font-medium">Consultas</div>
                                    </button>

                                    <button
                                        onClick={() => onNavigate('reports')}
                                        className="p-3 rounded-lg border text-center transition-colors bg-gray-50 hover:bg-gray-100 border-gray-200"
                                    >
                                        <div className="text-lg mb-1">⚕️</div>
                                        <div className="text-xs font-medium">Procedimentos</div>
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Atividade recente */}
                <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                        <CardDescription>
                            Últimas consultas realizadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📅</div>
                                <p className="text-gray-600 dark:text-gray-400">Nenhuma consulta registrada</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentActivity.map((consulta, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 dark:text-blue-300 text-sm">📋</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                Consulta #{consulta.id}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(consulta.data_consulta)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
