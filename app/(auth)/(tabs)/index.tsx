import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { getDistanceTwoCoordinate } from '@/utils/distance';

export default function Index() {
    const mapRef = useRef<MapView | null>(null);
    const [showModalGrantedLocation, setShowModalGrantedLocation] = useState(false);
    const [isPermissionDenied, setIsPermissionDenied] = useState(false);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

    async function getLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setShowModalGrantedLocation(true);
        } else {
            setShowModalGrantedLocation(false);
            const location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);
        }
    }

    async function getLocationPermissionAgain() {
        await getLocationPermission();
        if (showModalGrantedLocation) {
            setIsPermissionDenied(true);
        }
    }

    useEffect(() => {
        getLocationPermission();
    }, []);

    function getDistanceFromCurrentLocation(latitude: number, longitude: number) {
        if (!userLocation) return 'Unknown';
        const userLatitude = userLocation.coords.latitude;
        const userLongitude = userLocation.coords.longitude;

        return getDistanceTwoCoordinate(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude, longitude }
        );
    }

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
        {
            latitude: 37.7749,
            longitude: -122.4194,
            title: 'San Francisco',
            description: 'City in California',
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
        <>
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
                                coordinate={{
                                    latitude: marker.latitude,
                                    longitude: marker.longitude,
                                }}
                                onCalloutPress={() => router.push('/history')}>
                                <Callout>
                                    <View
                                        style={{
                                            padding: 10,
                                        }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                            {marker.title}
                                        </Text>
                                        <Text style={{ fontSize: 14 }}>{marker.description}</Text>
                                        <Text style={{ fontSize: 14 }}>
                                            Latitude: {marker.latitude}
                                        </Text>
                                        <Text style={{ fontSize: 14 }}>
                                            Longitude: {marker.longitude}
                                        </Text>
                                        <Text style={{ fontSize: 14 }}>
                                            Distance:{' '}
                                            {getDistanceFromCurrentLocation(
                                                marker.latitude,
                                                marker.longitude
                                            )}{' '}
                                            km
                                        </Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                </View>
            </View>
            <Portal>
                <Modal
                    visible={showModalGrantedLocation}
                    dismissable={false}
                    onDismiss={() => setShowModalGrantedLocation(false)}>
                    <View
                        style={{
                            margin: 20,
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                        }}>
                        <Text>
                            {isPermissionDenied
                                ? 'To get distance from current location, please allow the location permission in App Info Permission'
                                : 'Please enable location permission to use this feature.'}
                        </Text>
                        <View
                            style={{
                                marginTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}>
                            <Button onPress={() => setShowModalGrantedLocation(false)}>
                                Ignore
                            </Button>
                            {!isPermissionDenied && (
                                <Button onPress={getLocationPermissionAgain}>Enable</Button>
                            )}
                        </View>
                    </View>
                </Modal>
            </Portal>
        </>
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
