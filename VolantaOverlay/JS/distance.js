// Constants
const EARTH_RADIUS_KM = 6371; // Radius of the Earth in kilometers
const KILOMETERS_PER_MILE = 1.609344; // Conversion factor from miles to kilometers

/**
 * Converts degrees to radians.
 * @param {number} degrees - The angle in degrees.
 * @returns {number} - The angle in radians.
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates the great-circle distance between two points on the Earth's surface.
 * @param {number[]} coord1 - The latitude and longitude of the first point.
 * @param {number[]} coord2 - The latitude and longitude of the second point.
 * @returns {number} - The distance between the two points in kilometers.
 */
function calculateDistanceETA(coord1, coord2) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.sin(dLon / 2) ** 2 * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.asin(Math.sqrt(a));

  return EARTH_RADIUS_KM * c; // Distance in kilometers
}

/**
 * Calculates the ETA based on the current position, destination, and ground speed in knots.
 * @param {Object} currentPosition - The current position of the aircraft.
 * @param {Object} flight - The flight information including destination.
 * @returns {string} - The estimated time of arrival in "HH:mm" format.
 */
function calculateETA(currentPosition, flight) {
    // Helper function to calculate distance between two lat/lon points using Haversine formula
    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.asin(Math.sqrt(a));
        return R * c;
    }

    // Helper function to convert degrees to radians
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    const destination = flight.destination;
    const groundSpeedKnots = currentPosition.groundSpeed; // in knots

    // Convert ground speed from knots to kilometers per hour (kph)
    const groundSpeedKph = groundSpeedKnots * 1.852;

    // Calculate the distance from current position to destination
    const distanceKm = haversineDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        destination.latitude,
        destination.longitude
    );

    // Calculate time in hours
    const timeHours = distanceKm / groundSpeedKph;

    // Convert time to minutes
    const timeMinutes = timeHours * 60;

    // Current time in UTC
    const now = new Date();

    // Calculate ETA
    const eta = new Date(now.getTime() + timeMinutes * 60000);

    // Format ETA in HH:mmZ
    const hours = String(eta.getUTCHours()).padStart(2, '0');
    const minutes = String(eta.getUTCMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}Z`;
}