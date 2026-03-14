import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useToastStore from "../../store/useToastStore.js";
import api from "../../api/axios.js";

const statusBadge = { pending: "badge-yellow", accepted: "badge-green", rejected: "badge-red", cancelled: "badge-gray", completed: "badge-blue" };

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const { addToast } = useToastStore();

  useEffect(() => { api.get("/bookings/my-bookings").then((res) => { setBookings(res.data.bookings); setLoading(false); }); }, []);

  const cancelBooking = async (id) => {
    setCancelling(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
      addToast("Booking cancelled", "info");
    } finally { setCancelling(null); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen" style={{ background: "#fffef5" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="animate-fade-up mb-8">
          <div className="badge badge-blue inline-block mb-2">Passenger</div>
          <h1 className="text-3xl font-black">MY BOOKINGS</h1>
          <p className="text-sm text-gray-500 mt-0.5">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="card text-center py-16 animate-fade-up">
            <p className="text-4xl font-black mb-2" style={{ opacity: 0.1 }}>00</p>
            <p className="font-black text-lg">NO BOOKINGS YET</p>
            <p className="text-sm text-gray-500 mt-1">Search for rides and book your first seat to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => (
              <div key={b._id} className="card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <p className="font-black text-lg">
                        {b.ride?.source?.name} &rarr; {b.ride?.destination?.name}
                      </p>
                      <span className={`badge ${statusBadge[b.status] || "badge-gray"}`}>{b.status}</span>
                      <span className={`badge ${b.paymentStatus === "paid" ? "badge-green" : "badge-yellow"}`}>
                        {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{b.ride?.departureTime ? new Date(b.ride.departureTime).toLocaleString("en-IN") : ""}</p>
                    <p className="text-sm text-gray-600 mt-1 font-bold">{b.seatsBooked} seat{b.seatsBooked > 1 ? "s" : ""} / INR {b.totalPrice} / {b.paymentMethod}</p>
                  </div>
                  {(b.status === "pending" || b.status === "accepted") && (
                    <button onClick={() => cancelBooking(b._id)} disabled={cancelling === b._id} className="btn-danger">
                      {cancelling === b._id ? "..." : "Cancel"}
                    </button>
                  )}
                </div>
                {b.driver && (
                  <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: "2px solid #1a1a1a" }}>
                    <div className="w-7 h-7 flex items-center justify-center text-xs font-black"
                      style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
                      {b.driver?.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-bold">{b.driver?.name}</p>
                    {b.driver?.phone && <p className="text-xs text-gray-400">Ph: {b.driver.phone}</p>}
                  </div>
                )}
                {/* Tokens earned info for completed rides */}
                {b.status === "completed" && b.ride?.distanceKm > 0 && (
                  <div className="mt-2 pt-2 flex items-center gap-2" style={{ borderTop: "1px dashed #ccc" }}>
                    <div className="w-6 h-6 flex items-center justify-center font-black text-xs"
                      style={{ background: "#ffe156", border: "2px solid #1a1a1a" }}>T</div>
                    <p className="text-xs font-bold text-gray-500">Earned {Math.max(1, Math.floor(b.ride.distanceKm / 10))} tokens for this ride</p>
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

export default MyBookings;
