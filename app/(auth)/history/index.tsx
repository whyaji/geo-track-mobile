import { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

type RecordHistory = {
    id: number;
    latitude: number;
    longitude: number;
    speed: number;
    datetime: string;
};

const MemoizedMarker = memo(({ marker }: { marker: RecordHistory }) => (
    <Marker
        key={marker.id}
        coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
        }}
        title={marker.datetime}
        description={`Speed: ${marker.speed} km/h`}
    />
));

export default function HistoryScreen() {
    const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000); // 1 second interval
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const mapRef = useRef<MapView | null>(null);

    const markerList = RECORD_HISTORY;

    const initialRegion = useMemo(() => {
        const latitudes = markerList.map((marker) => marker.latitude);
        const longitudes = markerList.map((marker) => marker.longitude);
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLong = Math.min(...longitudes);
        const maxLong = Math.max(...longitudes);

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLong + maxLong) / 2,
            latitudeDelta: maxLat - minLat + 0.05,
            longitudeDelta: maxLong - minLong + 0.05,
        };
    }, [markerList]);

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
    }, [isPlaying, playbackSpeed, markerList.length]);

    useEffect(() => {
        if (mapRef.current) {
            const marker = markerList[currentMarkerIndex];
            mapRef.current.animateCamera({
                center: {
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                },
            });
        }
    }, [currentMarkerIndex, markerList]);

    const handleNext = useCallback(() => {
        setCurrentMarkerIndex((prevIndex) => (prevIndex + 1) % markerList.length);
    }, [markerList.length]);

    const handlePrev = useCallback(() => {
        setCurrentMarkerIndex(
            (prevIndex) => (prevIndex - 1 + markerList.length) % markerList.length
        );
    }, [markerList.length]);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const handleStop = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const handleSpeedChange = useCallback((speed: number) => {
        setPlaybackSpeed(speed);
    }, []);

    const currentMarker = useMemo(
        () => markerList[currentMarkerIndex],
        [currentMarkerIndex, markerList]
    );

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                    showsUserLocation>
                    {/* {marker start index 0 with color green} */}
                    <Marker
                        key={markerList[0].id}
                        coordinate={{
                            latitude: markerList[0].latitude,
                            longitude: markerList[0].longitude,
                        }}
                        title={markerList[0].datetime}
                        description={`Speed: ${markerList[0].speed} km/h`}
                        pinColor="green"
                    />
                    {/* {marker end last list with color red} */}
                    <Marker
                        key={markerList[markerList.length - 1].id}
                        coordinate={{
                            latitude: markerList[markerList.length - 1].latitude,
                            longitude: markerList[markerList.length - 1].longitude,
                        }}
                        title={markerList[markerList.length - 1].datetime}
                        description={`Speed: ${markerList[markerList.length - 1].speed} km/h`}
                        pinColor="red"
                    />
                    <MemoizedMarker marker={currentMarker} />
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

const RECORD_HISTORY: RecordHistory[] = [
    {
        id: 1,
        latitude: 37.7749,
        longitude: -122.4194,
        speed: 55,
        datetime: '2025-02-23T08:00:00Z',
    },
    {
        id: 2,
        latitude: 37.775,
        longitude: -122.4183,
        speed: 60,
        datetime: '2025-02-23T08:05:00Z',
    },
    {
        id: 3,
        latitude: 37.7762,
        longitude: -122.4175,
        speed: 62,
        datetime: '2025-02-23T08:10:00Z',
    },
    {
        id: 4,
        latitude: 37.7768,
        longitude: -122.4161,
        speed: 59,
        datetime: '2025-02-23T08:15:00Z',
    },
    {
        id: 5,
        latitude: 37.7775,
        longitude: -122.415,
        speed: 58,
        datetime: '2025-02-23T08:20:00Z',
    },
    {
        id: 6,
        latitude: 37.7781,
        longitude: -122.414,
        speed: 61,
        datetime: '2025-02-23T08:25:00Z',
    },
    {
        id: 7,
        latitude: 37.7787,
        longitude: -122.413,
        speed: 57,
        datetime: '2025-02-23T08:30:00Z',
    },
    {
        id: 8,
        latitude: 37.7793,
        longitude: -122.412,
        speed: 64,
        datetime: '2025-02-23T08:35:00Z',
    },
    {
        id: 9,
        latitude: 37.7799,
        longitude: -122.411,
        speed: 66,
        datetime: '2025-02-23T08:40:00Z',
    },
    {
        id: 10,
        latitude: 37.7805,
        longitude: -122.4101,
        speed: 65,
        datetime: '2025-02-23T08:45:00Z',
    },
    {
        id: 11,
        latitude: 37.7811,
        longitude: -122.4093,
        speed: 68,
        datetime: '2025-02-23T08:50:00Z',
    },
    {
        id: 12,
        latitude: 37.7817,
        longitude: -122.4082,
        speed: 70,
        datetime: '2025-02-23T08:55:00Z',
    },
    {
        id: 13,
        latitude: 37.7822,
        longitude: -122.4073,
        speed: 72,
        datetime: '2025-02-23T09:00:00Z',
    },
    {
        id: 14,
        latitude: 37.7828,
        longitude: -122.4064,
        speed: 73,
        datetime: '2025-02-23T09:05:00Z',
    },
    {
        id: 15,
        latitude: 37.7834,
        longitude: -122.4055,
        speed: 74,
        datetime: '2025-02-23T09:10:00Z',
    },
    {
        id: 16,
        latitude: 37.784,
        longitude: -122.4046,
        speed: 75,
        datetime: '2025-02-23T09:15:00Z',
    },
    {
        id: 17,
        latitude: 37.7846,
        longitude: -122.4037,
        speed: 76,
        datetime: '2025-02-23T09:20:00Z',
    },
    {
        id: 18,
        latitude: 37.7852,
        longitude: -122.4028,
        speed: 77,
        datetime: '2025-02-23T09:25:00Z',
    },
    {
        id: 19,
        latitude: 37.7858,
        longitude: -122.4019,
        speed: 78,
        datetime: '2025-02-23T09:30:00Z',
    },
    {
        id: 20,
        latitude: 37.7864,
        longitude: -122.4009,
        speed: 79,
        datetime: '2025-02-23T09:35:00Z',
    },
];
