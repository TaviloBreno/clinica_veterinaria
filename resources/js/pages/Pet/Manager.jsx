import React, { useState } from 'react';
import PetIndex from './Index';
import PetCreate from './Create';
import PetEdit from './Edit';

export default function PetManager() {
    const [currentView, setCurrentView] = useState('index'); // 'index', 'create', 'edit'
    const [selectedPetId, setSelectedPetId] = useState(null);

    const handleNewPet = () => {
        setCurrentView('create');
    };

    const handleEditPet = (petId) => {
        setSelectedPetId(petId);
        setCurrentView('edit');
    };

    const handleBack = () => {
        setCurrentView('index');
        setSelectedPetId(null);
    };

    const handlePetCreated = () => {
        setCurrentView('index');
    };

    const handlePetUpdated = () => {
        setCurrentView('index');
        setSelectedPetId(null);
    };

    if (currentView === 'create') {
        return (
            <PetCreate
                onBack={handleBack}
                onPetCreated={handlePetCreated}
            />
        );
    }

    if (currentView === 'edit') {
        return (
            <PetEdit
                petId={selectedPetId}
                onBack={handleBack}
                onPetUpdated={handlePetUpdated}
            />
        );
    }

    return (
        <PetIndex
            onNewPet={handleNewPet}
            onEditPet={handleEditPet}
        />
    );
}
