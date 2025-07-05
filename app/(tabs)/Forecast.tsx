import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Card } from 'react-native-paper';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../components/ThemeContext';
import { useSettings } from '../components/UnitContext';



const getWeatherIcon = (main:any, description:any) => {
    const iconMap = {
        Clear: 'weather-sunny',
        Clouds: {
            'few clouds': 'weather-partly-cloudy',
            'scattered clouds': 'weather-partly-cloudy',
            'broken clouds': 'weather-partly-cloudy',
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

const Forecast = ({city}) => {
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useAppTheme();
    const { unit } = useSettings();

    const styles = createStyles(theme);

    useEffect(() => {
        const fetchForecast = async () => {
            if (!city) return;
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${process.env.EXPO_PUBLIC_WEATHER_API}`
                );
                const daily = response.data.list.filter((item) =>
                    item.dt_txt.includes('12:00:00')
                );
                setForecast(daily);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchForecast();
    }, [city, unit]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} horizontal={true}>
            {forecast.map((item, index) => (
                <Card key={index} style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Text style={styles.date}>{new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short", day:"numeric",month:"short" })}</Text>
                        <MaterialCommunityIcons
                            name={getWeatherIcon(item.weather[0]?.main, item.weather[0]?.description)}
                            size={60}
                            color={theme.colors.primary}
                            style={{marginVertical:10}}
                        />

                        <Text style={styles.details}>{item.weather[0].description}</Text>
                        <View style={{flexDirection:'row', marginTop:5}}>
                            <Text style={styles.details}>{Math.round(item.main.temp_min)}°{unit === 'metric' ? 'C' : 'F'} / </Text>
                            <Text style={styles.details}>{Math.round(item.main.temp_max)}°{unit === 'metric' ? 'C' : 'F'}</Text>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    );
};

const createStyles = (theme:any) => StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginRight: 10,
        backgroundColor: theme.colors.surface,
        height: 230,
        width: 150,
        alignItems: 'center',
    },
    cardContent: {
        alignItems: 'center',
    },
    date: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.onSurface,
    },
    details:{
        color: theme.colors.onSurface,
    }
});

export default Forecast;