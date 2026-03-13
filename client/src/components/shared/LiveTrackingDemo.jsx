import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

const route = [
  [19.076, 72.877], [19.03, 73.01], [18.95, 73.09], [18.85, 73.15],
  [18.75, 73.22], [18.65, 73.38], [18.55, 73.55], [18.52, 73.85],
];

const makeIcon = (bg, label) => new L.DivIcon({
  html: `<div style="width:32px;height:32px;background:${bg};color:#1a1a1a;font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;border:3px solid #1a1a1a;box-shadow:3px 3px 0 #1a1a1a;">${label}</div>`,
  className: "", iconSize: [32, 32], iconAnchor: [16, 16],
});

const carIcon = makeIcon("#ffe156", "C");
const startIcon = makeIcon("#b8f3b0", "A");
const endIcon = makeIcon("#ff6b6b", "B");

const AnimatedCar = ({ route }) => {
  const [pos, setPos] = useState(route[0]);
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => { idx = (idx + 1) % route.length; setPos(route[idx]); }, 2000);
    return () => clearInterval(interval);
  }, [route]);
  return <Marker position={pos} icon={carIcon} />;
};

const LiveTrackingDemo = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => { setProgress((p) => (p >= 100 ? 0 : p + (100 / route.length))); }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <MapContainer center={[18.8, 73.35]} zoom={9} scrollWheelZoom={false} dragging={false} zoomControl={false} attributionControl={false}
        style={{ height: "420px", width: "100%", border: "none", boxShadow: "none" }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <Polyline positions={route} pathOptions={{ color: "#1a1a1a", weight: 3, dashArray: "10 8" }} />
        <Marker position={route[0]} icon={startIcon} />
        <Marker position={route[route.length - 1]} icon={endIcon} />
        <AnimatedCar route={route} />
      </MapContainer>

      {/* Route info */}
      <div className="absolute top-4 left-4 z-[1000] p-3" style={{
        background: "#fffef5", border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a"
      }}>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Route</p>
        <p className="font-black">Mumbai to Pune</p>
        <p className="text-xs text-gray-500">150 km / approx 3h</p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] p-3" style={{
        background: "#fffef5", border: "3px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a"
      }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#2e7d32" }}>Live Tracking</span>
          <span className="text-xs font-bold text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full h-3" style={{ background: "#e5e5e5", border: "2px solid #1a1a1a" }}>
          <div className="h-full transition-all duration-1000" style={{ width: `${progress}%`, background: "#ffe156" }} />
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingDemo;
