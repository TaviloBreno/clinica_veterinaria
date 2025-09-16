import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Pen, Trash2, Calendar, User, Heart, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

export default function ConsultasIndex({ onNewConsulta, onShowConsulta, onEditConsulta }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [consultaToDelete, setConsultaToDelete] = useState(null);

  useEffect(() => {
    loadConsultas();
  }, []);

  const loadConsultas = async () => {
    try {
      const response = await api.get('/consultas');
      setConsultas(response.data);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!consultaToDelete) return;
    
    try {
      await api.delete(`/consultas/${consultaToDelete.id}`);
      setConsultas(consultas.filter(c => c.id !== consultaToDelete.id));
      setConsultaToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir consulta:', error);
    }
  };

  const filteredConsultas = consultas.filter(consulta =>
    consulta.animal?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consulta.animal?.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consulta.veterinario?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consulta.motivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold tracking-tight">Consultas</h1>
          <p className="text-muted-foreground">
            Gerencie as consultas veterinárias
          </p>
        </div>
        <Button onClick={onNewConsulta}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Consulta
          </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Consultas</CardTitle>
          <CardDescription>
            {filteredConsultas.length} consulta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por animal, cliente, veterinário ou motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Animal</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veterinário</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultas.map((consulta) => (
                <TableRow key={consulta.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatDate(consulta.data_consulta)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>{consulta.animal?.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{consulta.animal?.cliente?.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <span>{consulta.veterinario?.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="truncate max-w-xs block" title={consulta.motivo}>
                      {consulta.motivo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-white ${statusColors[consulta.status]}`}>
                      {statusLabels[consulta.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(consulta.valor)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onShowConsulta(consulta.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEditConsulta(consulta.id)}>
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConsultaToDelete(consulta)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredConsultas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Stethoscope className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma consulta encontrada</p>
                      <p className="text-sm">
                        {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando uma nova consulta'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!consultaToDelete} onOpenChange={() => setConsultaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a consulta de {consultaToDelete?.animal?.nome}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}