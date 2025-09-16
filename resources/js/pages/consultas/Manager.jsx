import React, { useState } from 'react';
import ConsultasIndex from './ConsultasIndex';
import ConsultaCreate from './ConsultaCreate';
import ConsultaEdit from './ConsultaEdit';
import ConsultaShow from './ConsultaShow';

export default function ConsultaManager() {
    const [currentView, setCurrentView] = useState('index'); // 'index', 'create', 'edit', 'show'
    const [selectedConsultaId, setSelectedConsultaId] = useState(null);

    const handleNewConsulta = () => {
        setCurrentView('create');
    };

    const handleShowConsulta = (consultaId) => {
        setSelectedConsultaId(consultaId);
        setCurrentView('show');
    };

    const handleEditConsulta = (consultaId) => {
        setSelectedConsultaId(consultaId);
        setCurrentView('edit');
    };

    const handleBack = () => {
        setCurrentView('index');
        setSelectedConsultaId(null);
    };

    const handleConsultaCreated = () => {
        setCurrentView('index');
    };

    const handleConsultaUpdated = () => {
        setCurrentView('show');
    };

    const handleBackToList = () => {
        setCurrentView('index');
        setSelectedConsultaId(null);
    };

    if (currentView === 'create') {
        return (
            <ConsultaCreate
                onBack={handleBack}
                onConsultaCreated={handleConsultaCreated}
            />
        );
    }

    if (currentView === 'edit') {
        return (
            <ConsultaEdit
                consultaId={selectedConsultaId}
                onBack={() => setCurrentView('show')}
                onConsultaUpdated={handleConsultaUpdated}
            />
        );
    }

    if (currentView === 'show') {
        return (
            <ConsultaShow
                consultaId={selectedConsultaId}
                onBack={handleBackToList}
                onEdit={handleEditConsulta}
            />
        );
    }

    return (
        <ConsultasIndex
            onNewConsulta={handleNewConsulta}
            onShowConsulta={handleShowConsulta}
            onEditConsulta={handleEditConsulta}
        />
    );
}