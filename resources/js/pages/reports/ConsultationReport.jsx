import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Search, Filter, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { api } from '@/lib/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ConsultationReport({ onBack }) {
  const [data, setData] = useState({ consultas: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    data_from: '',
    data_to: '',
    veterinario_id: ''
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await api.get('/api/reports/consultations', { params: filters });
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar relatório de consultas:', error);
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
      status: '',
      data_from: '',
      data_to: '',
      veterinario_id: ''
    });
    setTimeout(() => {
      setLoading(true);
      loadReport();
    }, 100);
  };

  const exportData = () => {
    const csvData = data.consultas.map(consulta => ({
      'Data/Hora': formatDateTime(consulta.data_consulta),
      Animal: consulta.animal?.nome || '',
      Cliente: consulta.animal?.cliente?.nome || '',
      Veterinario: consulta.veterinario?.nome || '',
      Status: consulta.status,
      Motivo: consulta.motivo || '',
      'Total de Procedimentos': consulta.procedures?.length || 0,
      'Valor Total': (consulta.procedures || []).reduce((sum, proc) => sum + (proc.preco || 0), 0)
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_consultas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendada':
        return 'bg-blue-50 text-blue-700';
      case 'realizada':
        return 'bg-green-50 text-green-700';
      case 'cancelada':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'agendada':
        return 'Agendada';
      case 'realizada':
        return 'Realizada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Consultas</h1>
            <p className="text-muted-foreground">
              Análise completa das consultas e atendimentos
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Animal, cliente ou motivo..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data de Consulta (De)</Label>
              <Input
                type="date"
                value={filters.data_from}
                onChange={(e) => handleFilterChange('data_from', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Consulta (Até)</Label>
              <Input
                type="date"
                value={filters.data_to}
                onChange={(e) => handleFilterChange('data_to', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Veterinário</Label>
              <Input
                placeholder="ID do veterinário"
                value={filters.veterinario_id}
                onChange={(e) => handleFilterChange('veterinario_id', e.target.value)}
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
              <Calendar className="h-8 w-8 text-blue-600" />
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
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">{formatCurrency(data.stats.receita_total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">{formatCurrency(data.stats.ticket_medio)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">{data.stats.consultas_concluidas || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Consultas por status */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Situação atual das consultas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.stats.distribuicao_status || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(data.stats.distribuicao_status || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consultas por veterinário */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas por Veterinário</CardTitle>
            <CardDescription>Performance da equipe médica</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.stats.consultas_por_veterinario || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nome"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" name="Consultas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Evolução temporal */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Temporal</CardTitle>
          <CardDescription>Consultas e receita ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.stats.evolucao_temporal || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === 'receita' ? formatCurrency(value) : value,
                  name === 'receita' ? 'Receita' : 'Consultas'
                ]}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="consultas" stroke="#8884d8" name="Consultas" />
              <Line yAxisId="right" type="monotone" dataKey="receita" stroke="#82ca9d" name="Receita" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de consultas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Consultas</CardTitle>
          <CardDescription>
            {data.consultas.length} consulta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Data/Hora</TableHead>
                  <TableHead className="min-w-[120px]">Animal</TableHead>
                  <TableHead className="min-w-[140px]">Cliente</TableHead>
                  <TableHead className="min-w-[140px]">Veterinário</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[200px]">Procedimentos</TableHead>
                  <TableHead className="min-w-[100px]">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {data.consultas.map((consulta) => (
                <TableRow key={consulta.id}>
                  <TableCell>{formatDateTime(consulta.data_consulta)}</TableCell>
                  <TableCell className="font-medium">{consulta.animal?.nome || 'N/A'}</TableCell>
                  <TableCell>{consulta.animal?.cliente?.nome || 'N/A'}</TableCell>
                  <TableCell>{consulta.veterinario?.nome || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(consulta.status)}`}>
                      {getStatusText(consulta.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {consulta.procedures?.length || 0} procedimento(s)
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency((consulta.procedures || []).reduce((sum, proc) => sum + (proc.preco || 0), 0))}
                  </TableCell>
                </TableRow>
              ))}
              {data.consultas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma consulta encontrada</p>
                      <p className="text-sm">
                        Tente ajustar os filtros ou verificar se há consultas cadastradas
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
