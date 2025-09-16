import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Calendar, User, Heart, Stethoscope, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';

export default function ConsultaCreate({ onBack, onConsultaCreated }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Dados para os selects
  const [animais, setAnimais] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [procedures, setProcedures] = useState([]);
  
  // Formulário principal
  const [formData, setFormData] = useState({
    animal_id: '',
    veterinario_id: '',
    data_consulta: '',
    motivo: '',
    diagnostico: '',
    tratamento: '',
    observacoes: '',
    status: 'agendada'
  });

  // Procedimentos selecionados
  const [selectedProcedures, setSelectedProcedures] = useState([]);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const response = await api.get('/consultas/create');
      setAnimais(response.data.animais);
      setVeterinarios(response.data.veterinarios);
      setProcedures(response.data.procedures);
    } catch (error) {
      console.error('Erro ao carregar dados do formulário:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addProcedure = () => {
    if (procedures.length === 0) return;
    
    setSelectedProcedures(prev => [...prev, {
      id: procedures[0].id,
      quantidade: 1,
      valor_unitario: procedures[0].preco || 0,
      observacoes: ''
    }]);
  };

  const removeProcedure = (index) => {
    setSelectedProcedures(prev => prev.filter((_, i) => i !== index));
  };

  const updateProcedure = (index, field, value) => {
    setSelectedProcedures(prev => prev.map((proc, i) => 
      i === index ? { ...proc, [field]: value } : proc
    ));
  };

  const calculateTotal = () => {
    return selectedProcedures.reduce((total, proc) => {
      return total + (parseFloat(proc.quantidade) || 0) * (parseFloat(proc.valor_unitario) || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        procedures: selectedProcedures
      };

      await api.post('/consultas', submitData);
      onConsultaCreated();
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      alert('Erro ao criar consulta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <h1 className="text-3xl font-bold tracking-tight">Nova Consulta</h1>
          <p className="text-muted-foreground">
            Agende uma nova consulta veterinária
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Informações da Consulta</span>
            </CardTitle>
            <CardDescription>
              Preencha os dados básicos da consulta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="animal_id" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Animal *</span>
                </Label>
                <Select value={formData.animal_id} onValueChange={(value) => handleInputChange('animal_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animais.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id.toString()}>
                        {animal.nome} - {animal.cliente?.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="veterinario_id" className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Veterinário *</span>
                </Label>
                <Select value={formData.veterinario_id} onValueChange={(value) => handleInputChange('veterinario_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veterinário" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarios.map((veterinario) => (
                      <SelectItem key={veterinario.id} value={veterinario.id.toString()}>
                        {veterinario.nome} - CRMV: {veterinario.crmv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_consulta" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Data e Hora *</span>
                </Label>
                <Input
                  id="data_consulta"
                  type="datetime-local"
                  value={formData.data_consulta}
                  onChange={(e) => handleInputChange('data_consulta', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendada">Agendada</SelectItem>
                    <SelectItem value="realizada">Realizada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da Consulta *</Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo da consulta..."
                value={formData.motivo}
                onChange={(e) => handleInputChange('motivo', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnóstico</Label>
              <Textarea
                id="diagnostico"
                placeholder="Diagnóstico (opcional)..."
                value={formData.diagnostico}
                onChange={(e) => handleInputChange('diagnostico', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tratamento">Tratamento</Label>
              <Textarea
                id="tratamento"
                placeholder="Tratamento prescrito (opcional)..."
                value={formData.tratamento}
                onChange={(e) => handleInputChange('tratamento', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais (opcional)..."
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Procedimentos</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProcedure}
                disabled={procedures.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Procedimento
              </Button>
            </CardTitle>
            <CardDescription>
              Adicione os procedimentos realizados durante a consulta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedProcedures.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum procedimento adicionado
              </p>
            ) : (
              <div className="space-y-4">
                {selectedProcedures.map((procedure, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Procedimento {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProcedure(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Procedimento *</Label>
                        <Select
                          value={procedure.id.toString()}
                          onValueChange={(value) => {
                            const selectedProc = procedures.find(p => p.id.toString() === value);
                            updateProcedure(index, 'id', parseInt(value));
                            updateProcedure(index, 'valor_unitario', selectedProc?.preco || 0);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {procedures.map((proc) => (
                              <SelectItem key={proc.id} value={proc.id.toString()}>
                                {proc.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Quantidade *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={procedure.quantidade}
                          onChange={(e) => updateProcedure(index, 'quantidade', parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Valor Unitário *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={procedure.valor_unitario}
                          onChange={(e) => updateProcedure(index, 'valor_unitario', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Observações do Procedimento</Label>
                      <Textarea
                        placeholder="Observações específicas deste procedimento..."
                        value={procedure.observacoes}
                        onChange={(e) => updateProcedure(index, 'observacoes', e.target.value)}
                      />
                    </div>

                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">
                        Subtotal: {formatCurrency(procedure.quantidade * procedure.valor_unitario)}
                      </span>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="text-right">
                  <div className="text-lg font-semibold">
                    Total: {formatCurrency(calculateTotal())}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Consulta'}
          </Button>
        </div>
      </form>
    </div>
  );
}