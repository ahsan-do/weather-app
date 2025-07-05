import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../components/ThemeContext';

export default function SearchScreen() {
    const [city, setCity] = useState('');
    const router = useRouter();
    const { theme } = useAppTheme();

    const styles = createStyles(theme);

    const handleSearch = () => {
        if (city.trim()) {
            router.push({
                pathname: '/searchCities',
                params: { query: city.trim() },
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>

            </View>

            <View style={styles.content}>
                <TextInput
                    label="Enter city name"
                    value={city}
                    onChangeText={setCity}
                    style={styles.input}
                    mode="outlined"
                    onSubmitEditing={handleSearch}
                    textColor={theme.colors.onSurface}
                    contentStyle={styles.inputContent}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                />
                <Button
                    mode="contained"
                    onPress={handleSearch}
                    style={styles.button}
                    disabled={!city.trim()}
                    buttonColor={theme.colors.primary}
                    textColor={theme.colors.onSurface}
                >
                    Search Cities
                </Button>
            </View>
        </View>
    );
}

const createStyles = (theme:any) => StyleSheet.create({
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
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 10,
    },
    input: {
        marginBottom: 20,
        backgroundColor: theme.colors.surface,
    },
    inputContent: {
        color: theme.colors.onSurface,
    },
    button: {
        marginVertical: 10
    },
});