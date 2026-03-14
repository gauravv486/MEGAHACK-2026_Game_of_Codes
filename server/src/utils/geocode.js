// Free geocoding using OpenStreetMap Nominatim API
// No API key required — just respect the usage policy (1 req/sec)

const geocodeCity = async (cityName) => {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1&countrycodes=in`;
        const response = await fetch(url, {
            headers: { "User-Agent": "SeatSync/1.0" },
        });
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name,
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding failed:", error.message);
        return null;
    }
};

export default geocodeCity;
