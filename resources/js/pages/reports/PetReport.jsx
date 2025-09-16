import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Search, Filter, Heart, Users, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function PetReport({ onBack }) {
  const [data, setData] = useState({ animals: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    especie: '',
    sexo: '',
    created_from: '',
    created_to: ''
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await api.get('/api/reports/pets', { params: filters });
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar relatório de pets:', error);
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
      especie: '',
      sexo: '',
      created_from: '',
      created_to: ''
    });
    setTimeout(() => {
      setLoading(true);
      loadReport();
    }, 100);
  };

  const exportData = () => {
    const csvData = data.animals.map(animal => ({
      Nome: animal.nome,
      Especie: animal.especie,
      Raca: animal.raca || '',
      Sexo: animal.sexo,
      Idade: animal.idade || '',
      Peso: animal.peso || '',
      Dono: animal.cliente?.nome || '',
      'Data de Cadastro': new Date(animal.created_at).toLocaleDateString('pt-BR')
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_pets_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (nascimento) => {
    if (!nascimento) return 'N/A';
    const today = new Date();
    const birthDate = new Date(nascimento);
    const age = today.getFullYear() - birthDate.getFullYear();
    return `${age} ano(s)`;
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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Pets</h1>
            <p className="text-muted-foreground">
              Análise completa dos animais cadastrados
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
                  placeholder="Nome ou raça..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Espécie</Label>
              <Select value={filters.especie} onValueChange={(value) => handleFilterChange('especie', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="Cão">Cão</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Pássaro">Pássaro</SelectItem>
                  <SelectItem value="Coelho">Coelho</SelectItem>
                  <SelectItem value="Peixe">Peixe</SelectItem>
                  <SelectItem value="Réptil">Réptil</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select value={filters.sexo} onValueChange={(value) => handleFilterChange('sexo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="M">Macho</SelectItem>
                  <SelectItem value="F">Fêmea</SelectItem>
                </SelectContent>
              </Select>
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
              <Heart className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pets</p>
                <p className="text-2xl font-bold">{data.stats.total_animals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Espécies Diferentes</p>
                <p className="text-2xl font-bold">{data.stats.especies_diferentes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Machos</p>
                <p className="text-2xl font-bold">{data.stats.machos || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fêmeas</p>
                <p className="text-2xl font-bold">{data.stats.femeas || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribuição por espécie */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Espécie</CardTitle>
            <CardDescription>Percentual de animais por espécie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.stats.distribuicao_especies || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(data.stats.distribuicao_especies || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cadastros por mês */}
        <Card>
          <CardHeader>
            <CardTitle>Cadastros por Mês</CardTitle>
            <CardDescription>Evolução dos cadastros de pets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.stats.animais_por_mes || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#82ca9d" name="Novos Pets" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de pets */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pets</CardTitle>
          <CardDescription>
            {data.animals.length} pet(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Espécie</TableHead>
                <TableHead>Raça</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead>Cadastrado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.animals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.nome}</TableCell>
                  <TableCell>{animal.especie}</TableCell>
                  <TableCell>{animal.raca || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      animal.sexo === 'M' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-pink-50 text-pink-700'
                    }`}>
                      {animal.sexo === 'M' ? 'Macho' : 'Fêmea'}
                    </span>
                  </TableCell>
                  <TableCell>{calculateAge(animal.nascimento)}</TableCell>
                  <TableCell>{animal.peso ? `${animal.peso} kg` : 'N/A'}</TableCell>
                  <TableCell>{animal.cliente?.nome || 'N/A'}</TableCell>
                  <TableCell>{formatDate(animal.created_at)}</TableCell>
                </TableRow>
              ))}
              {data.animals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum pet encontrado</p>
                      <p className="text-sm">
                        Tente ajustar os filtros ou verificar se há pets cadastrados
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