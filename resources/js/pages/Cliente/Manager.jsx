import React, { useState } from 'react';
import ClienteIndex from './Index';
import ClienteCreate from './Create';
import ClienteEdit from './Edit';

export default function ClienteManager() {
    const [currentView, setCurrentView] = useState('index'); // 'index', 'create', 'edit'
    const [selectedClienteId, setSelectedClienteId] = useState(null);

    const handleNewCliente = () => {
        setCurrentView('create');
    };

    const handleEditCliente = (clienteId) => {
        setSelectedClienteId(clienteId);
        setCurrentView('edit');
    };

    const handleBack = () => {
        setCurrentView('index');
        setSelectedClienteId(null);
    };

    const handleClienteCreated = () => {
        setCurrentView('index');
    };

    const handleClienteUpdated = () => {
        setCurrentView('index');
        setSelectedClienteId(null);
    };

    if (currentView === 'create') {
        return (
            <ClienteCreate
                onBack={handleBack}
                onClienteCreated={handleClienteCreated}
            />
        );
    }

    if (currentView === 'edit') {
        return (
            <ClienteEdit
                clienteId={selectedClienteId}
                onBack={handleBack}
                onClienteUpdated={handleClienteUpdated}
            />
        );
    }

    return (
        <ClienteIndex
            onNewCliente={handleNewCliente}
            onEditCliente={handleEditCliente}
        />
    );
}