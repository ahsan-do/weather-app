import React, { useState, useEffect } from 'react';
import {View, StyleSheet, ActivityIndicator, Text, ScrollView} from 'react-native';
import { Card, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../components/ThemeContext';
import { useSettings } from '../components/UnitContext';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from '@expo/vector-icons/Ionicons';
import ForecastComponent from "@/app/(tabs)/Forecast";

const getWeatherIcon = (main, description) => {

    const hours:number = new Date().getHours()
    const isDayTime:boolean = hours > 6 && hours < 18

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

export default function City() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { weather: weatherParam } = useLocalSearchParams();
    const { theme} = useAppTheme();
    const { unit } = useSettings();

    const styles = createStyles(theme);

    useEffect(() => {
        if (weatherParam) {
            try {
                const weatherData = JSON.parse(weatherParam);
                setWeather(weatherData);
                setLoading(false);
            } catch (error) {
                console.error('Error parsing weather data:', error);
                setLoading(false);
            }
        } else {
            getCurrentLocationWeather();
        }
    }, [weatherParam]);

    const getCurrentLocationWeather = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                fetchWeatherByCity('London');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            fetchWeatherByCoords(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            console.error('Location error:', error);
            fetchWeatherByCity('London');
        }
    };

    const fetchWeatherByCoords = async (lat:number, lon:number, unit: 'metric' | 'imperial') => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.EXPO_PUBLIC_WEATHER_API}`
            );
            setWeather(response.data);
            setLoading(false);
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            setLoading(false);
        }
    };

    const fetchWeatherByCity = async (city:string,unit: 'metric' | 'imperial') => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${process.env.EXPO_PUBLIC_WEATHER_API}`
            );
            setWeather(response.data);
            setLoading(false);
        } catch (error) {
            console.error('API Error:', error);
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading weather data...</Text>
            </View>
        );
    }

    if (!weather) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No weather data available</Text>
                <Button mode="contained" onPress={() => router.push('/home')} style={styles.button}>
                    Back to Home
                </Button>
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

                                </View>
                            </>
                        )}
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.forcastContainer}><Ionicons name="time" size={24} color={theme.colors.onSurface} />
            <Text style={styles.forcastText}>5 Day Forecast</Text>
            </View>
            <ForecastComponent city={weather?.name}/>

            <Button mode="contained" onPress={() => router.push('/home')} style={styles.button}>
                Back to Home
            </Button>
        </ScrollView>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        paddingBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: 20,
    },
    card: {
        margin: 20,
        backgroundColor: theme.colors.surface,
        elevation: 4,
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
    detailsContainer: {
        marginTop: 20,
        flexDirection:'row',
        justifyContent:'flex-start',
        gap:20
    },
    details: {
        fontSize: 16,
        marginVertical: 2,
        color: theme.colors.onSurface,
    },
    toggleContainer: {
        alignItems: 'flex-end',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    button: {
        marginVertical: 10,
        marginHorizontal: 20,
    },
    loadingText: {
        marginTop: 10,
        textAlign: 'center',
        color: theme.colors.onSurface,
    },
    errorText: {
        color: theme.colors.onSurface,
        fontSize: 16,
        textAlign: 'center',
    },
    forcastContainer:{
      flexDirection:'row',
        gap:10,
        marginLeft:20
    },
    forcastText:{
        color: theme.colors.onSurface,
        fontSize: 16,
    }
})