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
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return isDark;
        }
        // Verificar preferência do sistema
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Aplicar imediatamente ao carregar
        if (systemDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return systemDark;
    });

    useEffect(() => {
        // Aplicar o tema ao documento
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
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
