import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import useRideStore from "../../store/useRideStore.js";

const PostRide = () => {
  const { createRide, loading } = useRideStore();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    sourceName: "", sourceAddress: "", sourceLat: "", sourceLng: "",
    destinationName: "", destinationAddress: "", destinationLat: "", destinationLng: "",
    departureTime: "", totalSeats: "3", pricePerSeat: "", distanceKm: "",
    description: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createRide(form);
    if (result.success) navigate("/my-rides");
    else setMsg(result.message);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a Ride</h1>

        {msg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Source</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                <input name="sourceName" value={form.sourceName} onChange={handleChange}
                  className="input-field" placeholder="Mumbai" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input name="sourceAddress" value={form.sourceAddress} onChange={handleChange}
                  className="input-field" placeholder="Dadar Bus Depot, Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input name="sourceLat" value={form.sourceLat} onChange={handleChange}
                  className="input-field" placeholder="19.0760" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input name="sourceLng" value={form.sourceLng} onChange={handleChange}
                  className="input-field" placeholder="72.8777" required />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Destination</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                <input name="destinationName" value={form.destinationName} onChange={handleChange}
                  className="input-field" placeholder="Pune" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input name="destinationAddress" value={form.destinationAddress} onChange={handleChange}
                  className="input-field" placeholder="Shivajinagar, Pune" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input name="destinationLat" value={form.destinationLat} onChange={handleChange}
                  className="input-field" placeholder="18.5204" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input name="destinationLng" value={form.destinationLng} onChange={handleChange}
                  className="input-field" placeholder="73.8567" required />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Ride Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date & Time</label>
                <input type="datetime-local" name="departureTime" value={form.departureTime}
                  onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                <select name="totalSeats" value={form.totalSeats}
                  onChange={handleChange} className="input-field">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Seat (Rs.)</label>
                <input type="number" name="pricePerSeat" value={form.pricePerSeat}
                  onChange={handleChange} className="input-field" placeholder="500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                <input type="number" name="distanceKm" value={form.distanceKm}
                  onChange={handleChange} className="input-field" placeholder="150" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea name="description" value={form.description}
                  onChange={handleChange} className="input-field" rows={2}
                  placeholder="Any notes for passengers..." />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Posting ride..." : "Post Ride"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRide;
