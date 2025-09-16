import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DarkModeDebug() {
    const { isDarkMode, toggleTheme } = useTheme();

    React.useEffect(() => {
        console.log('DarkModeDebug - isDarkMode:', isDarkMode);
        console.log('Document has dark class:', document.documentElement.classList.contains('dark'));
    }, [isDarkMode]);

    return (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔧 Debug Dark Mode
            </h3>

            <div className="space-y-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>Estado isDarkMode:</strong> {isDarkMode ? 'true' : 'false'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>Classe no HTML:</strong> {document.documentElement.classList.contains('dark') ? 'dark ✅' : 'sem dark ❌'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    <strong>LocalStorage:</strong> {localStorage.getItem('theme') || 'vazio'}
                </p>
            </div>

            <button
                onClick={toggleTheme}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded"
            >
                Toggle Theme (Debug)
            </button>

            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-gray-800 dark:text-gray-200">
                    Este fundo deve mudar de cinza claro para cinza escuro no dark mode
                </p>
            </div>
        </div>
    );
}
