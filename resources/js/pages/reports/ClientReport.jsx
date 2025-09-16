import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Search, Filter, Users, TrendingUp, Calendar, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';

export default function ClientReport({ onBack }) {
  const [data, setData] = useState({ clientes: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    created_from: '',
    created_to: ''
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await api.get('/api/reports/clients', { params: filters });
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar relatório de clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setLoading(true);
    loadReport();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      created_from: '',
      created_to: ''
    });
    setTimeout(() => {
      setLoading(true);
      loadReport();
    }, 100);
  };

  const exportData = () => {
    // Preparar dados para exportação
    const csvData = data.clientes.map(cliente => ({
      Nome: cliente.nome,
      Email: cliente.email,
      Telefone: cliente.telefone,
      Endereco: cliente.endereco || '',
      'Total de Animais': cliente.animals?.length || 0,
      'Data de Cadastro': new Date(cliente.created_at).toLocaleDateString('pt-BR')
    }));

    // Converter para CSV
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    // Download do arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_clientes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Clientes</h1>
            <p className="text-muted-foreground">
              Análise completa da base de clientes
            </p>
          </div>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, email ou telefone..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data de Cadastro (De)</Label>
              <Input
                type="date"
                value={filters.created_from}
                onChange={(e) => handleFilterChange('created_from', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Cadastro (Até)</Label>
              <Input
                type="date"
                value={filters.created_to}
                onChange={(e) => handleFilterChange('created_to', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <div className="flex space-x-2">
                <Button onClick={applyFilters} className="flex-1">
                  Aplicar
                </Button>
                <Button onClick={clearFilters} variant="outline" className="flex-1">
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold">{data.stats.total_clientes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Com Animais</p>
                <p className="text-2xl font-bold">{data.stats.clientes_com_animais || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média Animais/Cliente</p>
                <p className="text-2xl font-bold">{data.stats.media_animais_por_cliente || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">% Com Animais</p>
                <p className="text-2xl font-bold">
                  {data.stats.total_clientes > 0
                    ? Math.round((data.stats.clientes_com_animais / data.stats.total_clientes) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de clientes por mês */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastros de Clientes por Mês</CardTitle>
          <CardDescription>Evolução dos cadastros ao longo do ano</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.stats.clientes_por_mes || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Novos Clientes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {data.clientes.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Animais</TableHead>
                <TableHead>Data de Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {cliente.animals?.length || 0} {cliente.animals?.length === 1 ? 'animal' : 'animais'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(cliente.created_at)}</TableCell>
                </TableRow>
              ))}
              {data.clientes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum cliente encontrado</p>
                      <p className="text-sm">
                        Tente ajustar os filtros ou verificar se há clientes cadastrados
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
