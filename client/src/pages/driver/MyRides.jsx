import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const statusBadge = { scheduled: "badge-green", ongoing: "badge-yellow", completed: "badge-gray", cancelled: "badge-red" };
const bookingBadge = { pending: "badge-yellow", accepted: "badge-green", rejected: "badge-red", cancelled: "badge-gray", completed: "badge-blue" };

const MyRides = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRide, setExpandedRide] = useState(null);
  const [rideBookings, setRideBookings] = useState({});
  const [loadingBookings, setLoadingBookings] = useState({});

  useEffect(() => { api.get("/rides/driver/my-rides").then((res) => { setRides(res.data.rides); setLoading(false); }); }, []);

  const cancelRide = async (id) => {
    try {
      await api.put(`/rides/${id}/cancel`);
      setRides((prev) => prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r)));
      addToast("Ride cancelled", "info");
    } catch (err) { addToast(err.response?.data?.message || "Failed to cancel", "error"); }
  };

  const toggleBookings = async (rideId) => {
    if (expandedRide === rideId) { setExpandedRide(null); return; }
    setExpandedRide(rideId);

    if (rideBookings[rideId]) return;

    setLoadingBookings((prev) => ({ ...prev, [rideId]: true }));
    try {
      const res = await api.get(`/bookings/ride/${rideId}`);
      setRideBookings((prev) => ({ ...prev, [rideId]: res.data.bookings }));
    } catch (err) { addToast("Failed to load bookings", "error"); }
    finally { setLoadingBookings((prev) => ({ ...prev, [rideId]: false })); }
  };

  const completeBooking = async (bookingId, rideId) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/complete`);
      addToast(`Booking completed! ${res.data.tokensAwarded} tokens awarded`, "success");
      const updated = await api.get(`/bookings/ride/${rideId}`);
      setRideBookings((prev) => ({ ...prev, [rideId]: updated.data.bookings }));
    } catch (err) { addToast(err.response?.data?.message || "Failed", "error"); }
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
                  <div className="flex gap-2">
                    <button onClick={() => toggleBookings(ride._id)}
                      className="btn-outline !px-3 !py-2 !text-xs">
                      {expandedRide === ride._id ? "Hide" : "Passengers"}
                    </button>
                    {ride.status === "scheduled" && (
                      <button onClick={() => cancelRide(ride._id)} className="btn-danger">Cancel</button>
                    )}
                  </div>
                </div>

                {/* Expanded Bookings Section */}
                {expandedRide === ride._id && (
                  <div className="mt-4 pt-4" style={{ borderTop: "2px solid #1a1a1a" }}>
                    <p className="font-black uppercase tracking-wider text-xs mb-3">Passenger Bookings</p>
                    {loadingBookings[ride._id] ? (
                      <div className="py-4 text-center"><Spinner /></div>
                    ) : !rideBookings[ride._id] || rideBookings[ride._id].length === 0 ? (
                      <p className="text-sm text-gray-400 font-bold py-2">No bookings yet</p>
                    ) : (
                      <div className="space-y-2">
                        {rideBookings[ride._id].map((b) => (
                          <div key={b._id} className="p-3 flex justify-between items-center"
                            style={{ background: "#f9f9f0", border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" }}>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 flex items-center justify-center text-xs font-black"
                                style={{ background: "#a0d2ff", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                                {b.passenger?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-black text-sm">{b.passenger?.name}</p>
                                <p className="text-xs text-gray-500">Ph: {b.passenger?.phone || "N/A"} | {b.seatsBooked} seat{b.seatsBooked > 1 ? "s" : ""}</p>
                                <p className="text-xs text-gray-400">Pickup: {b.pickupPoint?.name || "---"}</p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-2">
                              <span className={`badge ${bookingBadge[b.status] || "badge-gray"}`}>{b.status}</span>
                              <span className={`badge ${b.paymentStatus === "paid" ? "badge-green" : "badge-yellow"}`}>
                                {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                              </span>
                              {b.status === "accepted" && (
                                <button onClick={() => completeBooking(b._id, ride._id)}
                                  className="btn-primary !px-2 !py-1 !text-xs">Complete</button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
