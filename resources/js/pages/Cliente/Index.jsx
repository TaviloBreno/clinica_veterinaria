import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import MainLayout from '../../components/Layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function ClienteIndex({ onNewCliente, onEditCliente }) {
    const { axiosInstance } = useAuth();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClientes, setFilteredClientes] = useState([]);

    useEffect(() => {
        fetchClientes();
    }, []);

    useEffect(() => {
        // Filtrar clientes baseado no termo de busca
        const filtered = clientes.filter(cliente =>
            cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.cpf.includes(searchTerm) ||
            cliente.telefone.includes(searchTerm) ||
            cliente.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.estado.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClientes(filtered);
    }, [clientes, searchTerm]);

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            alert('Erro ao carregar clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await axiosInstance.delete(`/api/clientes/${id}`);
                alert('Cliente excluído com sucesso!');
                fetchClientes();
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
                alert('Erro ao excluir cliente');
            }
        }
    };

    const formatCPF = (cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatTelefone = (telefone) => {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    if (loading) {
        return (
            <MainLayout title="Clientes">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando clientes...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Gerenciar Clientes">
            <div className="space-y-6">
                {/* Header com busca */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
                        <p className="text-gray-600">Gerencie os clientes da clínica veterinária</p>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={onNewCliente}>
                        + Novo Cliente
                    </Button>
                </div>

                {/* Barra de busca */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buscar Clientes</CardTitle>
                        <CardDescription>
                            Pesquise por nome, email, CPF, telefone, cidade ou estado
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search">Buscar</Label>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Digite o nome, email, CPF, telefone, cidade..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchTerm('')}
                                >
                                    Limpar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela de clientes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Lista de Clientes</CardTitle>
                                <CardDescription>
                                    {filteredClientes.length} cliente(s) encontrado(s)
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredClientes.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-6xl mb-4">👥</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm
                                        ? 'Tente ajustar os termos da sua busca'
                                        : 'Comece adicionando um novo cliente'
                                    }
                                </p>
                                {!searchTerm && (
                                    <Button onClick={onNewCliente}>
                                        + Adicionar Primeiro Cliente
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contato
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                CPF
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Endereço
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredClientes.map((cliente) => (
                                            <tr key={cliente.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <span className="text-blue-600 font-medium text-sm">
                                                                    {cliente.nome.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {cliente.nome}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {cliente.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{cliente.email}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {formatTelefone(cliente.telefone)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {formatCPF(cliente.cpf)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {cliente.endereco}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {cliente.cidade} - {cliente.estado}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Ver
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onEditCliente(cliente.id)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(cliente.id)}
                                                    >
                                                        Excluir
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
