import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { router } from 'expo-router';

export default function Index() {
    const mapRef = useRef<MapView | null>(null);

    // Marker list city in Indonesia
    const markerList = [
        {
            latitude: -6.2088,
            longitude: 106.8456,
            title: 'Jakarta',
            description: 'Capital city of Indonesia',
        },
        {
            latitude: -6.9175,
            longitude: 107.6191,
            title: 'Bandung',
            description: 'City in West Java',
        },
        {
            latitude: -7.2575,
            longitude: 112.7521,
            title: 'Surabaya',
            description: 'City in East Java',
        },
        {
            latitude: -6.1754,
            longitude: 106.8272,
            title: 'Bogor',
            description: 'City in West Java',
        },
        {
            latitude: -7.7956,
            longitude: 110.3695,
            title: 'Yogyakarta',
            description: 'City in Yogyakarta Special Region',
        },
    ];

    // Set initial region to Indonesia
    const initialRegion = {
        latitude: -0.7893,
        longitude: 113.9213,
        latitudeDelta: 30,
        longitudeDelta: 30,
    };

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                    toolbarEnabled={false}
                    showsUserLocation>
                    {markerList.map((marker, index) => (
                        <Marker
                            key={marker.title + index}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            title={marker.title}
                            description={marker.description}
                            onCalloutPress={() => router.push('/history')}
                        />
                    ))}
                </MapView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    controls: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
