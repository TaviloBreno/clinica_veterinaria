import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando clientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header com busca */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                    <p className="text-muted-foreground">Gerencie os clientes da clínica</p>
                </div>
                <Button onClick={onNewCliente}>
                    Novo Cliente
                </Button>
            </div>

            {/* Barra de busca */}
            <Card>
                <CardHeader>
                    <CardTitle>Pesquisar Clientes</CardTitle>
                    <CardDescription>
                        Busque por nome, email, CPF, telefone, cidade ou estado
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="search" className="sr-only">
                            Pesquisar
                        </Label>
                        <Input
                            id="search"
                            placeholder="Digite para pesquisar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lista de clientes */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>
                        {filteredClientes.length} cliente(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredClientes.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                {searchTerm ? 'Nenhum cliente encontrado com os critérios de busca.' : 'Nenhum cliente cadastrado.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredClientes.map((cliente) => (
                                <div key={cliente.id} className="flex items-center justify-between border rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                        <div>
                                            <h3 className="font-semibold">{cliente.nome}</h3>
                                            <p className="text-sm text-muted-foreground">{cliente.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm">CPF: {formatCPF(cliente.cpf)}</p>
                                            <p className="text-sm">Tel: {formatTelefone(cliente.telefone)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm">{cliente.cidade} - {cliente.estado}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {cliente.endereco}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditCliente(cliente)}
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}