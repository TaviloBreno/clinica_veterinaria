import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Verificar se está no browser
        if (typeof window === 'undefined') return false;

        // Verificar se há preferência salva no localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            // Aplicar imediatamente ao carregar
            document.documentElement.classList.toggle('dark', isDark);
            return isDark;
        }
        // Verificar preferência do sistema
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Aplicar imediatamente ao carregar
        document.documentElement.classList.toggle('dark', systemDark);
        return systemDark;
    });

    useEffect(() => {
        // Aplicar o tema ao documento de forma mais robusta
        document.documentElement.classList.toggle('dark', isDarkMode);

        // Salvar no localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        // Debug
        console.log('Theme changed to:', isDarkMode ? 'dark' : 'light');
        console.log('Document classes:', document.documentElement.className);
        console.log('Body classes:', document.body.className);
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
