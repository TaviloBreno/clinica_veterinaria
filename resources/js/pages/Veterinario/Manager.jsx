import React, { useState } from 'react';
import VeterinarioIndex from './Index';
import VeterinarioCreate from './Create';
import VeterinarioEdit from './Edit';

export default function VeterinarioManager({ onBack }) {
    const [currentView, setCurrentView] = useState('index'); // 'index', 'create', 'edit'
    const [selectedVeterinarioId, setSelectedVeterinarioId] = useState(null);

    const handleNewVeterinario = () => {
        setCurrentView('create');
    };

    const handleEditVeterinario = (veterinarioId) => {
        setSelectedVeterinarioId(veterinarioId);
        setCurrentView('edit');
    };

    const handleBack = () => {
        setCurrentView('index');
        setSelectedVeterinarioId(null);
    };

    const handleVeterinarioCreated = () => {
        setCurrentView('index');
    };

    const handleVeterinarioUpdated = () => {
        setCurrentView('index');
        setSelectedVeterinarioId(null);
    };

    if (currentView === 'create') {
        return (
            <VeterinarioCreate
                onBack={handleBack}
                onVeterinarioCreated={handleVeterinarioCreated}
            />
        );
    }

    if (currentView === 'edit') {
        return (
            <VeterinarioEdit
                veterinarioId={selectedVeterinarioId}
                onBack={handleBack}
                onVeterinarioUpdated={handleVeterinarioUpdated}
            />
        );
    }

    return (
        <VeterinarioIndex
            onBack={onBack}
            onNewVeterinario={handleNewVeterinario}
            onEditVeterinario={handleEditVeterinario}
        />
    );
}
