import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

const pinIcon = (color) => new L.DivIcon({
  html: `<div style="width:28px;height:28px;background:${color};color:#1a1a1a;font-weight:900;font-size:14px;display:flex;align-items:center;justify-content:center;border:3px solid #1a1a1a;box-shadow:3px 3px 0 #1a1a1a;">P</div>`,
  className: "", iconSize: [28, 28], iconAnchor: [14, 28],
});

const ClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 12, { duration: 0.5 });
  }, [position, map]);
  return null;
};

const LocationPicker = ({ label, color = "#ffe156", value, onChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const center = value ? [value.lat, value.lng] : [20.5937, 78.9629];
  const zoom = value ? 12 : 5;

  const handleSearchInput = (query) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in`,
          { headers: { "User-Agent": "SeatSync/1.0" } }
        );
        const data = await res.json();
        setSuggestions(data.map((d) => ({
          name: d.display_name.split(",").slice(0, 3).join(","),
          lat: parseFloat(d.lat),
          lng: parseFloat(d.lon),
        })));
      } catch { setSuggestions([]); }
      finally { setSearching(false); }
    }, 400);
  };

  const selectSuggestion = (s) => {
    onChange({ lat: s.lat, lng: s.lng, name: s.name });
    setSearchQuery(s.name);
    setSuggestions([]);
  };

  const handleMapClick = ({ lat, lng }) => {
    onChange({ lat, lng, name: searchQuery || `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
  };

  return (
    <div>
      <label className="block text-sm font-black uppercase tracking-wider mb-2">{label}</label>

      {/* search input */}
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search for a city or place..."
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          className="input-field"
        />
        {searching && (
          <div className="absolute right-3 top-3 text-xs font-bold text-gray-400">Searching...</div>
        )}
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1" style={{ border: "2px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a", background: "#fff" }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => selectSuggestion(s)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-yellow-100 cursor-pointer font-medium transition-colors"
                style={{ borderBottom: i < suggestions.length - 1 ? "1px solid #e5e5e5" : "none" }}>
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* map */}
      <div style={{ border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a", height: "220px" }}>
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}
          attributionControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          <ClickHandler onLocationSelect={handleMapClick} />
          {value && (
            <>
              <FlyToLocation position={[value.lat, value.lng]} />
              <Marker position={[value.lat, value.lng]} icon={pinIcon(color)} />
            </>
          )}
        </MapContainer>
      </div>

      {value && (
        <p className="text-xs text-gray-500 mt-1 font-bold">
          Selected: {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
