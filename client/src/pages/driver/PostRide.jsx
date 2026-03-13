import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import useRideStore from "../../store/useRideStore.js";
import useToastStore from "../../store/useToastStore.js";

const PostRide = () => {
  const { createRide, loading } = useRideStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    sourceName: "", sourceAddress: "", sourceLat: "", sourceLng: "",
    destinationName: "", destinationAddress: "", destinationLat: "", destinationLng: "",
    departureTime: "", totalSeats: "3", pricePerSeat: "", distanceKm: "", description: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createRide(form);
    if (result.success) { addToast("Ride posted successfully", "success"); navigate("/my-rides"); }
    else setMsg(result.message);
  };

  const Label = ({ children }) => <label className="block text-sm font-black uppercase tracking-wider mb-1">{children}</label>;

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="animate-fade-up mb-8">
          <div className="badge badge-yellow inline-block mb-3">Driver</div>
          <h1 className="text-3xl font-black">POST A RIDE</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to offer seats on your trip</p>
        </div>

        {msg && <div className="mb-6 p-3 text-sm font-bold animate-fade-up" style={{ background: "#ff6b6b", border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}>{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="card animate-fade-up">
            <h2 className="font-black uppercase tracking-wider text-sm mb-4" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "8px" }}>Source</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label>City Name</Label><input name="sourceName" value={form.sourceName} onChange={handleChange} className="input-field" placeholder="Mumbai" required /></div>
              <div className="col-span-2"><Label>Full Address</Label><input name="sourceAddress" value={form.sourceAddress} onChange={handleChange} className="input-field" placeholder="Dadar Bus Depot, Mumbai" /></div>
              <div><Label>Latitude</Label><input name="sourceLat" value={form.sourceLat} onChange={handleChange} className="input-field" placeholder="19.0760" required /></div>
              <div><Label>Longitude</Label><input name="sourceLng" value={form.sourceLng} onChange={handleChange} className="input-field" placeholder="72.8777" required /></div>
            </div>
          </div>

          <div className="card animate-fade-up-delay">
            <h2 className="font-black uppercase tracking-wider text-sm mb-4" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "8px" }}>Destination</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label>City Name</Label><input name="destinationName" value={form.destinationName} onChange={handleChange} className="input-field" placeholder="Pune" required /></div>
              <div className="col-span-2"><Label>Full Address</Label><input name="destinationAddress" value={form.destinationAddress} onChange={handleChange} className="input-field" placeholder="Shivajinagar, Pune" /></div>
              <div><Label>Latitude</Label><input name="destinationLat" value={form.destinationLat} onChange={handleChange} className="input-field" placeholder="18.5204" required /></div>
              <div><Label>Longitude</Label><input name="destinationLng" value={form.destinationLng} onChange={handleChange} className="input-field" placeholder="73.8567" required /></div>
            </div>
          </div>

          <div className="card animate-fade-up-delay-2">
            <h2 className="font-black uppercase tracking-wider text-sm mb-4" style={{ borderBottom: "2px solid #1a1a1a", paddingBottom: "8px" }}>Ride Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label>Departure</Label><input type="datetime-local" name="departureTime" value={form.departureTime} onChange={handleChange} className="input-field" required /></div>
              <div><Label>Seats</Label><select name="totalSeats" value={form.totalSeats} onChange={handleChange} className="input-field">{[1,2,3,4,5,6].map((n)=><option key={n} value={n}>{n}</option>)}</select></div>
              <div><Label>Price / Seat (INR)</Label><input type="number" name="pricePerSeat" value={form.pricePerSeat} onChange={handleChange} className="input-field" placeholder="500" required /></div>
              <div><Label>Distance (km)</Label><input type="number" name="distanceKm" value={form.distanceKm} onChange={handleChange} className="input-field" placeholder="150" /></div>
              <div className="col-span-2"><Label>Notes</Label><textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={2} placeholder="Any notes for passengers..." /></div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Posting..." : "Post Ride"}</button>
        </form>
      </div>
    </div>
  );
};

export default PostRide;
