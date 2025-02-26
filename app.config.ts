import { type ExpoConfig } from 'expo/config';

export default (): ExpoConfig => {
    const productName = 'Geo Track';
    const pkgId = 'com.whyaji.geotrack';
    return {
        name: productName,
        slug: 'whyajigeotrack',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        newArchEnabled: false,
        ios: {
            bundleIdentifier: pkgId,
            supportsTablet: true,
            config: {
                googleMapsApiKey: process.env['EXPO_PUBLIC_GOOGLE_MAPS_API_KEY'],
            },
        },
        android: {
            package: pkgId,
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            config: {
                googleMaps: {
                    apiKey: process.env['EXPO_PUBLIC_GOOGLE_MAPS_API_KEY'],
                },
            },
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            'expo-sqlite',
            [
                'expo-splash-screen',
                {
                    image: './assets/images/splash-icon.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                },
            ],
            [
                'expo-location',
                {
                    locationAlwaysAndWhenInUsePermission: `Allow ${productName} to use your location.`,
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            eas: {
                projectId: process.env['EXPO_PUBLIC_PROJECT_ID'],
            },
        },
        updates: {
            url: `https://u.expo.dev/${process.env['EXPO_PUBLIC_PROJECT_ID']}`,
        },
        runtimeVersion: {
            policy: 'appVersion',
        },
    };
};
