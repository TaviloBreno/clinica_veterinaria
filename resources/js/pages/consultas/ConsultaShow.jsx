import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Heart, 
  Stethoscope, 
  FileText, 
  Pen, 
  Activity,
  DollarSign,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';

const statusColors = {
  agendada: 'bg-blue-500 hover:bg-blue-600',
  realizada: 'bg-green-500 hover:bg-green-600',
  cancelada: 'bg-red-500 hover:bg-red-600'
};

const statusLabels = {
  agendada: 'Agendada',
  realizada: 'Realizada',
  cancelada: 'Cancelada'
};

export default function ConsultaShow({ consultaId, onBack, onEdit }) {
  const [consulta, setConsulta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConsulta();
  }, [consultaId]);

  const loadConsulta = async () => {
    try {
      const response = await api.get(`/consultas/${consultaId}`);
      setConsulta(response.data);
    } catch (error) {
      console.error('Erro ao carregar consulta:', error);
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const calculateProcedureTotal = (procedure) => {
    return procedure.pivot.quantidade * procedure.pivot.valor_unitario;
  };

  const calculateTotal = () => {
    if (!consulta.procedures) return 0;
    return consulta.procedures.reduce((total, procedure) => {
      return total + calculateProcedureTotal(procedure);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!consulta) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Consulta não encontrada</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Detalhes da Consulta</h1>
            <p className="text-muted-foreground">
              Consulta #{consulta.id} - {consulta.animal?.nome}
            </p>
          </div>
        </div>
        <Button onClick={() => onEdit(consultaId)}>
          <Pen className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Informações da Consulta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data e Hora</p>
                    <p className="font-medium">{formatDate(consulta.data_consulta)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={`text-white ${statusColors[consulta.status]}`}>
                      {statusLabels[consulta.status]}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Motivo da Consulta</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {consulta.motivo}
                </p>
              </div>

              {consulta.diagnostico && (
                <div>
                  <h4 className="font-medium mb-2">Diagnóstico</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {consulta.diagnostico}
                  </p>
                </div>
              )}

              {consulta.tratamento && (
                <div>
                  <h4 className="font-medium mb-2">Tratamento</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {consulta.tratamento}
                  </p>
                </div>
              )}

              {consulta.observacoes && (
                <div>
                  <h4 className="font-medium mb-2">Observações</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {consulta.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Procedimentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Procedimentos Realizados</span>
              </CardTitle>
              <CardDescription>
                {consulta.procedures?.length || 0} procedimento(s) realizado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!consulta.procedures || consulta.procedures.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum procedimento realizado nesta consulta
                </p>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Procedimento</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Valor Unitário</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consulta.procedures.map((procedure) => (
                        <TableRow key={procedure.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{procedure.nome}</p>
                              {procedure.pivot.observacoes && (
                                <p className="text-sm text-muted-foreground">
                                  {procedure.pivot.observacoes}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{procedure.pivot.quantidade}</TableCell>
                          <TableCell>{formatCurrency(procedure.pivot.valor_unitario)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(calculateProcedureTotal(procedure))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator />

                  <div className="flex justify-end">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total da Consulta</p>
                      <p className="text-2xl font-bold">{formatCurrency(calculateTotal())}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com informações do animal e veterinário */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Animal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{consulta.animal?.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Espécie</p>
                <p className="font-medium">{consulta.animal?.especie}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Raça</p>
                <p className="font-medium">{consulta.animal?.raca}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Idade</p>
                <p className="font-medium">{consulta.animal?.idade} anos</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso</p>
                <p className="font-medium">{consulta.animal?.peso} kg</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Cliente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{consulta.animal?.cliente?.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{consulta.animal?.cliente?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{consulta.animal?.cliente?.telefone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5" />
                <span>Veterinário</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{consulta.veterinario?.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CRMV</p>
                <p className="font-medium">{consulta.veterinario?.crmv}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Especialidade</p>
                <p className="font-medium">{consulta.veterinario?.especialidade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{consulta.veterinario?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{consulta.veterinario?.telefone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Resumo Financeiro</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Procedimentos:</span>
                  <span className="font-medium">{consulta.procedures?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}