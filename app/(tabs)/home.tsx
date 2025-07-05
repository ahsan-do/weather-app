import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

import { Card, Button, Text, Menu, Divider } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../components/ThemeContext';
import { useSettings } from '../components/UnitContext';
import ForecastComponent from './Forecast';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const getWeatherIcon = (main: any, description: any) => {
    const hours:number = new Date().getHours()
    const isDayTime:boolean = hours > 6 && hours < 20

    const iconMap = {
        Clear: 'weather-sunny',
        Clouds: {
            'few clouds': isDayTime ? 'weather-partly-cloudy': 'weather-night-partly-cloudy',
            'scattered clouds': isDayTime ? 'weather-partly-cloudy': 'weather-night-partly-cloudy',
            'broken clouds': isDayTime ? 'weather-partly-cloudy': 'weather-night-partly-cloudy',
            'overcast clouds': 'weather-cloudy',
            default: 'weather-cloudy',
        },
        Rain: 'weather-rainy',
        Snow: 'weather-snowy',
        Thunderstorm: 'weather-lightning',
        Drizzle: 'weather-rainy',
        Mist: 'weather-fog',
        default: 'weather-cloudy',
    };



    if (main && iconMap[main] && typeof iconMap[main] === 'object') {
        return iconMap[main][description?.toLowerCase()] || iconMap[main].default;
    }
    return iconMap[main] || iconMap.default;
};

export default function HomeScreen() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();
    const { weather: searchWeather } = useLocalSearchParams();
    const { theme, isDark, toggleTheme } = useAppTheme();
    const { unit, toggleUnit } = useSettings();

    const styles = createStyles(theme);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                fetchWeatherByCity('London', unit);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            fetchWeatherByCoords(location.coords.latitude, location.coords.longitude, unit);
        })();
    }, []);

    useEffect(() => {
        if (searchWeather) {
            setWeather(JSON.parse(searchWeather));
            setLoading(false);
        }
    }, [searchWeather]);

    const fetchWeatherByCoords = async (lat: number, lon: number, unit: 'metric' | 'imperial') => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.EXPO_PUBLIC_WEATHER_API}`
            );
            console.log('Fetch by Coords - Unit:', unit, 'Response:', response.data);
            setWeather(response.data);
            setLoading(false);
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            setLoading(false);
        }
    };

    const fetchWeatherByCity = async (city: string, unit: 'metric' | 'imperial') => {
        try {
            console.log('Fetching Weather for City:', city, 'with Unit:', unit);
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${process.env.EXPO_PUBLIC_WEATHER_API}`
            );
            console.log('Fetched Weather:', response.data);
            setWeather(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleToggleUnit = async () => {
        setLoading(true);
        setMenuVisible(false);
        toggleUnit();
        setWeather(null);
        if (weather?.name) {
            await fetchWeatherByCity(weather.name, unit === 'metric' ? 'imperial' : 'metric');
        } else {
            setLoading(false);
        }
    };

    const handleThemeToggle = () => {
        toggleTheme();
        setMenuVisible(false);
    };

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
            </View>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.cityTitle}>{weather?.name || 'Loading...'}, {weather.sys.country}</Text>
                    <View style={styles.iconContainer}>
                        {weather && (
                            <MaterialCommunityIcons
                                name={getWeatherIcon(weather?.weather[0]?.main, weather?.weather[0]?.description)}
                                size={80}
                                color={theme.colors.primary}
                            />
                        )}
                    </View>
                    <Text style={styles.description}>
                        {weather?.weather[0]?.description?.charAt(0).toUpperCase() + weather?.weather[0]?.description?.slice(1) || 'N/A'}
                    </Text>
                    {weather && (
                        <Text style={[styles.temperature, { color: theme.colors.primary }]}>
                            {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                        </Text>
                    )}
                    <View>
                        {weather && (
                            <>
                                <Text style={styles.details}>Feels like: {Math.round(weather.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}</Text>
                                <View style={styles.detailsContainer}>
                                    <Text style={styles.details}><MaterialIcons name="water-drop" size={18} color={theme.colors.onSurface}/> {weather.main.humidity}%</Text>

                                    <Text style={styles.details}><Feather name="wind" size={18} color={theme.colors.onSurface} /> {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</Text>
                                    <Text style={styles.details}><MaterialCommunityIcons name="weather-sunset-up" size={18} color={theme.colors.onSurface} /> {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </Card.Content>

                <TouchableOpacity style={styles.options} onPress={openMenu}>
                    <Ionicons name="options-outline" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>

                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={{ x: 10, y: 50 }}
                    contentStyle={styles.menuContent}
                >
                    <Menu.Item
                        onPress={handleToggleUnit}
                        title={`Switch to ${unit === 'metric' ? '°F' : '°C'}`}
                        leadingIcon="thermometer"
                    />
                    <Divider />
                    <Menu.Item
                        onPress={handleThemeToggle}
                        title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
                        leadingIcon={isDark ? 'weather-sunny' : 'weather-night'}
                    />
                </Menu>
            </Card>
            <ForecastComponent city={weather?.name}/>
            <Button mode="contained" onPress={() => router.push('/search')} style={styles.button}>
                Search City
            </Button>

        </ScrollView>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    card: {
        marginBottom: 10,
        paddingBottom: 10,
        backgroundColor: theme.colors.surface,
        position: 'relative',
    },
    cityTitle: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    description: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
        color: theme.colors.onSurface,
    },
    temperature: {
        textAlign: 'center',
        paddingVertical: 8,
        fontSize: 48,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 16,
        marginVertical: 2,
        color: theme.colors.onSurface,
    },
    detailsContainer:{
        marginTop: 20,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    button: {
        marginVertical: 10,
    },
    options:{
        position: 'absolute',
        top: 10,
        left: 10,
    },
    menuContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    }
});