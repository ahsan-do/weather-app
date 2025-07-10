export interface WeatherData {
    name: string;
    sys: {
        country: string;
        sunrise: number;
    };
    weather: Array<{
        main: string;
        description: string;
    }>;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
}

export interface CloudsMap {
    [key: string]: string;
    default: string;
}

export interface IconMap {
    [key: string]: string | CloudsMap;
    Clear: string;
    Clouds: CloudsMap;
    Rain: string;
    Snow: string;
    Thunderstorm: string;
    Drizzle: string;
    Mist: string;
    default: string;
}