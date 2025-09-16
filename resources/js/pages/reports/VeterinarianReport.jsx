import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Search, Filter, UserCheck, Calendar, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '@/lib/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function VeterinarianReport({ onBack }) {
  const [data, setData] = useState({ veterinarios: [], stats: {} });
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
      const response = await api.get('/api/reports/veterinarians', { params: filters });
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar relatório de veterinários:', error);
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
    const csvData = data.veterinarios.map(veterinario => ({
      Nome: veterinario.nome,
      Email: veterinario.email,
      Telefone: veterinario.telefone,
      CRMV: veterinario.crmv,
      Especialidade: veterinario.especialidade || '',
      'Total de Consultas': veterinario.consultas_count || 0,
      'Data de Cadastro': new Date(veterinario.created_at).toLocaleDateString('pt-BR')
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_veterinarios_${new Date().toISOString().split('T')[0]}.csv`;
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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Veterinários</h1>
            <p className="text-muted-foreground">
              Análise da equipe de veterinários e performance
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
                  placeholder="Nome, email ou CRMV..."
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
              <UserCheck className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Veterinários</p>
                <p className="text-2xl font-bold">{data.stats.total_veterinarios || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Consultas</p>
                <p className="text-2xl font-bold">{data.stats.total_consultas || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média Consultas/Veterinário</p>
                <p className="text-2xl font-bold">
                  {data.stats.total_veterinarios > 0
                    ? Math.round((data.stats.total_consultas || 0) / data.stats.total_veterinarios)
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Especialidades</p>
                <p className="text-2xl font-bold">{data.stats.especialidades_diferentes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance por veterinário */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Veterinário</CardTitle>
            <CardDescription>Número de consultas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.stats.performance_veterinarios || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nome"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consultas" fill="#8884d8" name="Consultas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por especialidade */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Especialidade</CardTitle>
            <CardDescription>Veterinários por área de especialização</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.stats.distribuicao_especialidades || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(data.stats.distribuicao_especialidades || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Evolução mensal de cadastros */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Cadastros</CardTitle>
          <CardDescription>Novos veterinários cadastrados por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.stats.veterinarios_por_mes || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" name="Novos Veterinários" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de veterinários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Veterinários</CardTitle>
          <CardDescription>
            {data.veterinarios.length} veterinário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>CRMV</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Consultas</TableHead>
                <TableHead>Cadastrado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.veterinarios.map((veterinario) => (
                <TableRow key={veterinario.id}>
                  <TableCell className="font-medium">{veterinario.nome}</TableCell>
                  <TableCell>{veterinario.email}</TableCell>
                  <TableCell>{veterinario.telefone}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {veterinario.crmv}
                    </span>
                  </TableCell>
                  <TableCell>{veterinario.especialidade || 'N/A'}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      {veterinario.consultas_count || 0} consultas
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(veterinario.created_at)}</TableCell>
                </TableRow>
              ))}
              {data.veterinarios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <UserCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum veterinário encontrado</p>
                      <p className="text-sm">
                        Tente ajustar os filtros ou verificar se há veterinários cadastrados
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
