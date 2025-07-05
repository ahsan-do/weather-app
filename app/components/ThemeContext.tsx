import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';


const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#87CEEB',
        primaryContainer: '#E3F2FD',
        background: '#f0f8ff',
        surface: '#FFFFFF',
        surfaceVariant: '#F5F5F5',
        onSurface: '#000000',
        onSurfaceVariant: '#666666',
        outline: '#CCCCCC',
    },
};

const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#4FC3F7',
        primaryContainer: '#87CEEB',
        background: '#121212',
        surface: '#1E1E1E',
        surfaceVariant: '#2D2D2D',
        onSurface: '#FFFFFF',
        onSurfaceVariant: '#CCCCCC',
        outline: '#444444',
    },
};

interface ThemeContextType {
    theme: typeof lightTheme;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

    useEffect(() => {

        setIsDark(systemColorScheme === 'dark');
    }, [systemColorScheme]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext