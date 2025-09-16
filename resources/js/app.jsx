import React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Sistema Veterinário
                    </h1>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Clientes</CardTitle>
                                <CardDescription>
                                    Gerencie clientes e seus dados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">
                                    Ver Clientes
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Animais</CardTitle>
                                <CardDescription>
                                    Cadastro e prontuário dos animais
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">
                                    Ver Animais
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Consultas</CardTitle>
                                <CardDescription>
                                    Agendamento e histórico de consultas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">
                                    Ver Consultas
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Painel de Controle</CardTitle>
                            <CardDescription>
                                Sistema de gestão veterinária em desenvolvimento
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline">
                                    Novo Cliente
                                </Button>
                                <Button variant="outline">
                                    Novo Animal
                                </Button>
                                <Button variant="outline">
                                    Nova Consulta
                                </Button>
                                <Button variant="outline">
                                    Relatórios
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

// Encontrar o elemento root e renderizar a aplicação React
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}