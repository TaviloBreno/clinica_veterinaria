import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import MainLayout from '../../components/Layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function VeterinarioIndex({ onBack, onNewVeterinario, onEditVeterinario }) {
    const { axiosInstance } = useAuth();
    const [veterinarios, setVeterinarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVeterinarios();
    }, []);

    const fetchVeterinarios = async () => {
        try {
            const response = await axiosInstance.get('/api/veterinarios');
            setVeterinarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar veterinários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este veterinário?')) {
            try {
                await axiosInstance.delete(`/api/veterinarios/${id}`);
                setVeterinarios(veterinarios.filter(vet => vet.id !== id));
            } catch (error) {
                console.error('Erro ao excluir veterinário:', error);
                alert('Erro ao excluir veterinário');
            }
        }
    };

    if (loading) {
        return (
            <MainLayout title="Veterinários">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Gerenciar Veterinários">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Veterinários</h1>
                        <p className="text-gray-600 dark:text-gray-400">Gerencie os veterinários da clínica</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={onBack} variant="outline">
                            ← Voltar
                        </Button>
                        <Button onClick={onNewVeterinario}>
                            + Novo Veterinário
                        </Button>
                    </div>
                </div>

                {/* Lista de Veterinários */}
                {veterinarios.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">👨‍⚕️</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhum veterinário cadastrado
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Comece adicionando o primeiro veterinário da clínica
                            </p>
                            <Button onClick={onNewVeterinario}>
                                Cadastrar Primeiro Veterinário
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {veterinarios.map((veterinario) => (
                            <Card key={veterinario.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 dark:text-blue-300 text-xl">👨‍⚕️</span>
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{veterinario.nome}</CardTitle>
                                                <CardDescription>CRMV: {veterinario.crmv}</CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <span className="w-4 h-4 mr-2">📧</span>
                                            {veterinario.email}
                                        </div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <span className="w-4 h-4 mr-2">📞</span>
                                            {veterinario.telefone}
                                        </div>
                                        {veterinario.especialidade && (
                                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                                <span className="w-4 h-4 mr-2">🩺</span>
                                                {veterinario.especialidade}
                                            </div>
                                        )}
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <span className="w-4 h-4 mr-2">📅</span>
                                            {veterinario.consultas?.length || 0} consultas
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditVeterinario(veterinario.id)}
                                            className="flex-1"
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(veterinario.id)}
                                            className="flex-1"
                                        >
                                            Excluir
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
