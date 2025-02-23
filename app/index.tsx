import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Index() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000); // 1 second interval
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
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

    useEffect(() => {
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, [currentMarkerIndex]);

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentMarkerIndex((prevIndex) => (prevIndex + 1) % markerList.length);
            }, playbackSpeed);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, playbackSpeed]);

    useEffect(() => {
        if (mapRef.current) {
            const marker = markerList[currentMarkerIndex];
            mapRef.current.animateToRegion({
                latitude: marker.latitude,
                longitude: marker.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    }, [currentMarkerIndex]);

    const handleNext = () => {
        setCurrentMarkerIndex((prevIndex) => (prevIndex + 1) % markerList.length);
    };

    const handlePrev = () => {
        setCurrentMarkerIndex(
            (prevIndex) => (prevIndex - 1 + markerList.length) % markerList.length
        );
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handleStop = () => {
        setIsPlaying(false);
    };

    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
    };

    return (
        <View style={styles.container}>
            {errorMsg && <Text>{errorMsg}</Text>}
            {location && (
                <View style={styles.container}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={initialRegion}
                        showsUserLocation>
                        <Marker
                            key={markerList[currentMarkerIndex].title}
                            coordinate={{
                                latitude: markerList[currentMarkerIndex].latitude,
                                longitude: markerList[currentMarkerIndex].longitude,
                            }}
                            title={markerList[currentMarkerIndex].title}
                            description={markerList[currentMarkerIndex].description}
                        />
                        <Polyline
                            coordinates={markerList.map((marker) => ({
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }))}
                            strokeColor="blue"
                            strokeWidth={2}
                        />
                    </MapView>
                    <View style={styles.controls}>
                        <Button title="Prev" onPress={handlePrev} />
                        <Button title="Next" onPress={handleNext} />
                        <Button
                            title={isPlaying ? 'Stop' : 'Play'}
                            onPress={isPlaying ? handleStop : handlePlay}
                        />
                        <Button title="Speed x0.5" onPress={() => handleSpeedChange(2000)} />
                        <Button title="Speed x1" onPress={() => handleSpeedChange(1000)} />
                        <Button title="Speed x2" onPress={() => handleSpeedChange(500)} />
                    </View>
                </View>
            )}
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
