import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Heart,
  Stethoscope,
  Calendar,
  Activity,
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import ClientReport from './ClientReport';
import PetReport from './PetReport';
import ProcedureReport from './ProcedureReport';
import VeterinarianReport from './VeterinarianReport';
import ConsultationReport from './ConsultationReport';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportsIndex({ onNavigateToReport }) {
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResponse, chartsResponse] = await Promise.all([
        api.get('/api/reports'),
        api.get('/api/reports/charts')
      ]);

      setStats(statsResponse.data);
      setCharts(chartsResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSkeletonCard = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSkeletonChart = () => (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const navigateToReport = (reportType) => {
    setCurrentView(reportType);
  };

  const backToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Renderizar componentes específicos baseado na view atual
  if (currentView === 'clients') {
    return <ClientReport onBack={backToDashboard} />;
  }

  if (currentView === 'pets') {
    return <PetReport onBack={backToDashboard} />;
  }

  if (currentView === 'procedures') {
    return <ProcedureReport onBack={backToDashboard} />;
  }

  if (currentView === 'veterinarians') {
    return <VeterinarianReport onBack={backToDashboard} />;
  }

  if (currentView === 'consultations') {
    return <ConsultationReport onBack={backToDashboard} />;
  }

  const reportCards = [
    {
      title: 'Relatório de Clientes',
      description: 'Análise completa da base de clientes',
      icon: Users,
      value: stats.total_clientes,
      action: () => navigateToReport('clients'),
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      title: 'Relatório de Animais',
      description: 'Estatísticas dos pets cadastrados',
      icon: Heart,
      value: stats.total_animals,
      action: () => navigateToReport('pets'),
      color: 'bg-red-50 border-red-200 text-red-700'
    },
    {
      title: 'Relatório de Procedimentos',
      description: 'Análise de procedimentos e receitas',
      icon: Activity,
      value: stats.total_procedures,
      action: () => navigateToReport('procedures'),
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      title: 'Relatório de Veterinários',
      description: 'Performance da equipe médica',
      icon: Stethoscope,
      value: stats.total_veterinarios,
      action: () => navigateToReport('veterinarians'),
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      title: 'Relatório de Consultas',
      description: 'Análise de atendimentos e receitas',
      icon: Calendar,
      value: stats.total_consultas,
      action: () => navigateToReport('consultations'),
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Dashboard completo com análises e relatórios do sistema
          </p>
        </div>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <div key={index}>{renderSkeletonCard()}</div>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Receita do Mês</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.receita_mes_atual)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Consultas do Mês</p>
                    <p className="text-2xl font-bold">{stats.consultas_mes_atual}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Consultas Pendentes</p>
                    <p className="text-2xl font-bold">{stats.consultas_pendentes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Registros</p>
                    <p className="text-2xl font-bold">
                      {(stats.total_clientes || 0) + (stats.total_animais || 0) + (stats.total_consultas || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Cards de relatórios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {reportCards.map((report, index) => (
          <Card key={index} className={`cursor-pointer hover:shadow-lg transition-shadow ${report.color}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                <report.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="truncate">{report.title}</span>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <p className="text-xl md:text-2xl font-bold">{report.value || 0}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Total de registros</p>
                </div>
                <Button onClick={report.action} variant="outline" size="sm" className="text-xs md:text-sm">
                  <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Ver Relatório</span>
                  <span className="sm:hidden">Ver</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {loading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <div key={index}>{renderSkeletonChart()}</div>
            ))}
          </>
        ) : (
          <>
            {/* Gráfico de consultas por mês */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Consultas por Mês</CardTitle>
                <CardDescription className="text-xs md:text-sm">Evolução dos atendimentos nos últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                  <LineChart data={charts.consultas_por_mes || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes"
                  fontSize={12}
                  className="md:text-sm"
                />
                <YAxis
                  fontSize={12}
                  className="md:text-sm"
                />
                <Tooltip
                  contentStyle={{ fontSize: '12px' }}
                  className="md:text-sm"
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  className="md:text-sm"
                />
                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Consultas" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de receita por mês */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Receita por Mês</CardTitle>
            <CardDescription className="text-xs md:text-sm">Evolução da receita nos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <BarChart data={charts.receita_por_mes || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes"
                  fontSize={12}
                  className="md:text-sm"
                />
                <YAxis
                  fontSize={12}
                  className="md:text-sm"
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Receita']}
                  contentStyle={{ fontSize: '12px' }}
                  className="md:text-sm"
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  className="md:text-sm"
                />
                <Bar dataKey="receita" fill="#82ca9d" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de animais por espécie */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm md:text-base">Animais por Espécie</CardTitle>
            <CardDescription className="text-xs md:text-sm">Distribuição dos animais cadastrados por espécie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
              <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                <PieChart>
                  <Pie
                    data={charts.animais_por_especie || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={window.innerWidth < 768 ? 60 : 80}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {(charts.animais_por_especie || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-col space-y-2">
                {(charts.animais_por_especie || []).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{item.especie}</span>
                    <span className="text-sm text-muted-foreground">({item.total})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>

      {/* Resumo executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Resumo Executivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">👥 Clientes</h4>
              <p>Total: {stats.total_clientes || 0} clientes cadastrados</p>
              <p>Crescimento: Análise disponível no relatório detalhado</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-2">🐕 Animais</h4>
              <p>Total: {stats.total_animais || 0} pets cadastrados</p>
              <p>Distribuição por espécie disponível no gráfico</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-700 mb-2">👨‍⚕️ Veterinários</h4>
              <p>Total: {stats.total_veterinarios || 0} profissionais</p>
              <p>Performance individual no relatório específico</p>
            </div>
            <div>
              <h4 className="font-semibold text-orange-700 mb-2">📅 Consultas</h4>
              <p>Total: {stats.total_consultas || 0} consultas realizadas</p>
              <p>Pendentes: {stats.consultas_pendentes || 0} agendadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
