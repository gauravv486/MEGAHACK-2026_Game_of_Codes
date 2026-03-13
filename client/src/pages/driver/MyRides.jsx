import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const statusBadge = { scheduled: "badge-green", ongoing: "badge-yellow", completed: "badge-gray", cancelled: "badge-red" };

const MyRides = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get("/rides/driver/my-rides").then((res) => { setRides(res.data.rides); setLoading(false); }); }, []);

  const cancelRide = async (id) => {
    try {
      await api.put(`/rides/${id}/cancel`);
      setRides((prev) => prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r)));
      addToast("Ride cancelled", "info");
    } catch (err) { addToast(err.response?.data?.message || "Failed to cancel", "error"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8 animate-fade-up">
          <div>
            <div className="badge badge-yellow inline-block mb-2">Driver</div>
            <h1 className="text-3xl font-black">MY RIDES</h1>
            <p className="text-sm text-gray-500 mt-0.5">{rides.length} ride{rides.length !== 1 ? "s" : ""} posted</p>
          </div>
          <button onClick={() => navigate("/post-ride")} className="btn-primary">+ Post Ride</button>
        </div>

        {rides.length === 0 ? (
          <div className="card text-center py-16 animate-fade-up">
            <p className="text-4xl font-black mb-2" style={{ opacity: 0.1 }}>00</p>
            <p className="font-black text-lg">NO RIDES POSTED YET</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">Start by posting your first ride and earn money on your commute.</p>
            <button onClick={() => navigate("/post-ride")} className="btn-primary">Post First Ride</button>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride, i) => (
              <div key={ride._id} className="card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <p className="font-black text-lg">{ride.source.name} &rarr; {ride.destination.name}</p>
                      <span className={`badge ${statusBadge[ride.status] || "badge-gray"}`}>{ride.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(ride.departureTime).toLocaleString("en-IN")}</p>
                    <p className="text-sm text-gray-600 mt-1 font-bold">{ride.availableSeats}/{ride.totalSeats} seats / INR {ride.pricePerSeat} per seat</p>
                  </div>
                  {ride.status === "scheduled" && (
                    <button onClick={() => cancelRide(ride._id)} className="btn-danger">Cancel</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
