import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useRideStore from "../../store/useRideStore.js";
import useAuthStore from "../../store/useAuthStore.js";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const makeIcon = (bg, label) => new L.DivIcon({
  html: `<div style="width:30px;height:30px;background:${bg};color:#1a1a1a;font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;border:3px solid #1a1a1a;box-shadow:3px 3px 0 #1a1a1a;">${label}</div>`,
  className: "", iconSize: [30, 30], iconAnchor: [15, 15],
});

const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => { if (points.length >= 2) map.fitBounds(points, { padding: [50, 50] }); }, [map, points]);
  return null;
};

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRide, loading, getRideById } = useRideStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => { getRideById(id); }, [id]);

  const handleBook = async () => {
    if (!user) return navigate("/login");
    setBooking(true);
    try {
      await api.post("/bookings/create", { rideId: id, seatsBooked: seats, paymentMethod: "cash" });
      addToast("Ride booked! Waiting for driver confirmation.", "success");
    } catch (err) { addToast(err.response?.data?.message || "Booking failed.", "error"); }
    finally { setBooking(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!currentRide) return <div className="min-h-screen flex items-center justify-center"><p className="font-black text-gray-400">Ride not found.</p></div>;

  const ride = currentRide;
  const srcCoords = ride.source?.coordinates?.coordinates;
  const destCoords = ride.destination?.coordinates?.coordinates;
  const hasMap = srcCoords && destCoords && srcCoords.length === 2 && destCoords.length === 2;
  const mapPoints = hasMap ? [[srcCoords[1], srcCoords[0]], [destCoords[1], destCoords[0]]] : [];

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)}
          className="text-sm font-bold uppercase tracking-wider mb-6 block cursor-pointer hover:underline">
          &larr; Back
        </button>

        {hasMap && (
          <div className="mb-5 animate-fade-up" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <MapContainer center={mapPoints[0]} zoom={9} scrollWheelZoom={false} dragging={false} zoomControl={false} attributionControl={false}
              style={{ height: "280px", width: "100%", border: "none", boxShadow: "none" }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
              <FitBounds points={mapPoints} />
              <Polyline positions={mapPoints} pathOptions={{ color: "#1a1a1a", weight: 3, dashArray: "10 8" }} />
              <Marker position={mapPoints[0]} icon={makeIcon("#b8f3b0", "A")} />
              <Marker position={mapPoints[1]} icon={makeIcon("#ff6b6b", "B")} />
            </MapContainer>
          </div>
        )}

        <div className="card mb-4 animate-fade-up-delay">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-3xl font-black">{ride.source.name} &rarr; {ride.destination.name}</p>
              <p className="text-sm text-gray-500 mt-1">{ride.source.address} to {ride.destination.address}</p>
              <p className="text-gray-500 mt-2 text-sm">{new Date(ride.departureTime).toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">&#8377;{ride.pricePerSeat}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400">per seat</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: "2px solid #1a1a1a" }}>
            <div className="text-center">
              <p className="text-2xl font-black">{ride.availableSeats}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400">Seats Left</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black">{ride.distanceKm || "---"}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400">KM</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: "#2e7d32" }}>{ride.co2SavedPerPassenger || 0}</p>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400">KG CO2 Saved</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="card animate-fade-up-delay-2">
            <h3 className="font-black uppercase tracking-wider text-sm mb-3" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "6px" }}>Driver</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center text-sm font-black"
                style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                {ride.driver?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-black">{ride.driver?.name}</p>
                <p className="text-sm text-gray-500">{ride.driver?.averageRating > 0 ? `${ride.driver.averageRating} stars` : "New driver"} / Trust: {ride.driver?.trustScore}</p>
              </div>
            </div>
          </div>

          <div className="card animate-fade-up-delay-2">
            <h3 className="font-black uppercase tracking-wider text-sm mb-3" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "6px" }}>Vehicle</h3>
            <p className="font-bold">{ride.vehicle?.make} {ride.vehicle?.model}</p>
            <p className="text-sm text-gray-500">{ride.vehicle?.color} / {ride.vehicle?.registrationNumber}</p>
          </div>
        </div>

        {ride.description && (
          <div className="card mb-4 animate-fade-up-delay-3">
            <h3 className="font-black uppercase tracking-wider text-sm mb-2" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "6px" }}>Notes</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{ride.description}</p>
          </div>
        )}

        {user?.role === "passenger" && ride.status === "scheduled" && (
          <div className="card-yellow p-6 animate-fade-up-delay-3" style={{ border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a" }}>
            <h3 className="font-black uppercase tracking-wider text-sm mb-4">Book Seats</h3>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm font-bold">Seats</label>
              <select value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="input-field w-20 !py-2">
                {Array.from({ length: ride.availableSeats }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-sm font-bold">Total: <span className="text-xl font-black">&#8377;{ride.pricePerSeat * seats}</span></span>
            </div>
            <button onClick={handleBook} disabled={booking} className="btn-primary w-full" style={{ background: "#1a1a1a", color: "#ffe156" }}>
              {booking ? "Booking..." : "Book Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetails;
