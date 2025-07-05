import { Stack } from 'expo-router';
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function Layout() {
    return (
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name="home" options={{headerShown: false }} />
                <Stack.Screen name="search" options={{ headerShown: false }} />
                <Stack.Screen name="searchCities" options={{ headerShown: false }} />
                <Stack.Screen name="city" options={{ headerShown: false  }} />
                <Stack.Screen name="Forecast" options={{headerShown: false  }} />
            </Stack>
        </SafeAreaProvider>
    );
}