import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useAppTheme } from './components/ThemeContext';
import { UnitProvider } from './components/UnitContext';

function App() {
    const { theme, isDark } = useAppTheme();

    return (
        <PaperProvider theme={theme}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </PaperProvider>
    );
}

export default function Layout() {
    return (
        <ThemeProvider>
            <UnitProvider>
                <App />
            </UnitProvider>
        </ThemeProvider>
    );
}