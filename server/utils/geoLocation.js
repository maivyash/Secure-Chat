// Simulate geo-location data (in production, use real IP geolocation API)
const getGeoLocation = () => {
  const locations = [
    { latitude: 38.9072, longitude: -77.0369, city: 'Washington DC', country: 'USA' },
    { latitude: 51.5074, longitude: -0.1278, city: 'London', country: 'UK' },
    { latitude: 48.8566, longitude: 2.3522, city: 'Paris', country: 'France' },
    { latitude: 35.6762, longitude: 139.6503, city: 'Tokyo', country: 'Japan' },
    { latitude: 28.6139, longitude: 77.2090, city: 'New Delhi', country: 'India' },
    { latitude: 33.3152, longitude: 44.3661, city: 'Baghdad', country: 'Iraq' },
    { latitude: 52.5200, longitude: 13.4050, city: 'Berlin', country: 'Germany' },
    { latitude: -33.8688, longitude: 151.2093, city: 'Sydney', country: 'Australia' }
  ];
  
  return locations[Math.floor(Math.random() * locations.length)];
};

module.exports = { getGeoLocation };
