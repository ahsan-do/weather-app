import React, { useState, useEffect } from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Card} from 'react-native-paper';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSettings } from '../components/UnitContext';
import { useAppTheme } from '../components/ThemeContext';

export default function SearchCitiesScreen() {
    const { query } = useLocalSearchParams();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { theme } = useAppTheme();
    const { unit } = useSettings();

    const styles = createStyles(theme);

    useEffect(() => {
        if (query) {
            setLoading(true);
            axios.get(
                `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&units=${unit}&appid=${process.env.EXPO_PUBLIC_WEATHER_API}`
            )
                .then(response => {
                    setCities(response.data.list || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [query, unit]);

    const handleSelectCity = (cityWeather) => {
        router.push({
            pathname: '/city',
            params: { weather: JSON.stringify(cityWeather) },
        });
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>

            </View>

            {cities.length === 0 ? (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                        No cities found for "{query}"
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={cities}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectCity(item)}>
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Text style={styles.cityTitle}>
                                        {item.name}, {item.sys.country}
                                    </Text>
                                    <Text style={styles.temperature}>
                                        Temp: {Math.round(item?.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                                    </Text>
                                    <Text style={styles.description}>
                                        Weather: {item.weather[0]?.description}
                                    </Text>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    header: {
        padding: 30,
        paddingBottom: 10,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    unitButton: {
        marginRight: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        color: theme.colors.onSurface,
        fontSize: 16,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noResultsText: {
        color: theme.colors.onSurface,
        fontSize: 16,
        textAlign: 'center',
    },
    card: {
        marginBottom: 10,
        marginHorizontal: 20,
        backgroundColor: theme.colors.surface,
    },
    cityTitle: {
        color: theme.colors.onSurface,
        fontSize: 18,
        fontWeight: 'bold',
    },
    temperature: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: '600',
        marginTop: 5,
    },
    description: {
        color: theme.colors.onSurfaceVariant,
        fontSize: 14,
        marginTop: 2,
        textTransform: 'capitalize',
    },
});