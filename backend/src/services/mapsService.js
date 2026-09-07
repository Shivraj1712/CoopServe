/**
 * Maps & Geo-Matching Service Abstraction Layer
 * 
 * PHASE 1 (Current): Uses Haversine spherical distance formula on seeded coordinates.
 * PHASE 2 (Future): Swap in real Google Maps Distance Matrix & Geocoding APIs.
 */

/**
 * Calculate distance in km between two lat/lng pairs using Haversine formula
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

export const mapsService = {
  /**
   * Find nearest available + verified workers sorted by proximity (km)
   */
  findNearestWorkers(userLat, userLng, workersList, maxDistanceKm = 20) {
    // PHASE 1: Haversine distance matching
    const matched = workersList
      .map((worker) => {
        const dist = calculateHaversineDistance(userLat, userLng, worker.lat, worker.lng);
        return { ...worker, distanceKm: dist };
      })
      .filter((w) => w.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    console.log(`[MOCK MAPS SERVICE] Found ${matched.length} nearby workers for lat:${userLat}, lng:${userLng}`);
    return matched;

    /* PHASE 2 TODO: Google Maps Distance Matrix API
    const response = await googleMapsClient.distancematrix({ ... });
    return formattedResults;
    */
  },

  /**
   * Mock Geocoding (Lat/Lng -> Human Address string)
   */
  async reverseGeocode(lat, lng) {
    // PHASE 1: Pre-set mock address map or default
    const mockLocations = [
      { name: "Navrangpura, CG Road, Ahmedabad, Gujarat", lat: 23.037, lng: 72.562 },
      { name: "SG Highway, Bodakdev, Ahmedabad, Gujarat", lat: 23.039, lng: 72.511 },
      { name: "Satellite, Anandnagar, Ahmedabad, Gujarat", lat: 23.013, lng: 72.514 },
      { name: "Prahlad Nagar, Corporate Road, Ahmedabad", lat: 23.003, lng: 72.502 },
      { name: "Sector 11, Gandhinagar, Gujarat", lat: 23.215, lng: 72.636 }
    ];

    const found = mockLocations.find(
      (loc) => Math.abs(loc.lat - lat) < 0.05 && Math.abs(loc.lng - lng) < 0.05
    );

    return found ? found.name : `Location (${lat.toFixed(4)}, ${lng.toFixed(4)}), Ahmedabad, GJ`;

    /* PHASE 2 TODO: Google Maps Geocoding API
    const res = await googleMapsClient.geocode({ latlng: [lat, lng] });
    return res.data.results[0].formatted_address;
    */
  }
};
