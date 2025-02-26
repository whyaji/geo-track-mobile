type Coordinate = {
    latitude: number;
    longitude: number;
};

export function getDistanceTwoCoordinate(
    firstCoordinate: Coordinate,
    secondCoordinate: Coordinate
) {
    // Convert latitude/longitude differences to kilometers
    const latitudeDifference = firstCoordinate.latitude - secondCoordinate.latitude;
    const longitudeDifference = firstCoordinate.longitude - secondCoordinate.longitude;

    // Approximate 1 degree difference = 111 km
    const distance = Math.sqrt(
        Math.pow(latitudeDifference * 111, 2) + Math.pow(longitudeDifference * 111, 2)
    );

    return distance.toFixed(1); // distance in kilometers
}
