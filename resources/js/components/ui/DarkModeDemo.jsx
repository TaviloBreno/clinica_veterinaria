import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useTheme } from '../../contexts/ThemeContext';

export default function DarkModeDemo() {
    const { isDarkMode } = useTheme();

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {isDarkMode ? '🌙' : '☀️'}
                    Modo {isDarkMode ? 'Escuro' : 'Claro'} Ativo
                </CardTitle>
                <CardDescription>
                    O sistema agora suporta alternância entre modo claro e escuro
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ✅ Dark mode implementado com sucesso
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ✅ Elemento indesejado da dashboard removido
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ✅ Transições suaves entre temas
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ✅ Botão de alternância no header
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
