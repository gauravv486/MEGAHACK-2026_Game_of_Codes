import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import api from "../../api/axios.js";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
  completed: "bg-blue-100 text-blue-700",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    api.get("/bookings/my-bookings").then((res) => {
      setBookings(res.data.bookings);
      setLoading(false);
    });
  }, []);

  const cancelBooking = async (id) => {
    setCancelling(id);
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm mt-1">Search for rides and book your first seat</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900">
                        {booking.ride?.source?.name} → {booking.ride?.destination?.name}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {booking.ride?.departureTime
                        ? new Date(booking.ride.departureTime).toLocaleString("en-IN")
                        : ""}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {booking.seatsBooked} seat{booking.seatsBooked > 1 ? "s" : ""} · Rs.{booking.totalPrice} · {booking.paymentMethod}
                    </p>
                  </div>

                  {(booking.status === "pending" || booking.status === "accepted") && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      disabled={cancelling === booking._id}
                      className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg">
                      {cancelling === booking._id ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>

                {booking.driver && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs">
                      {booking.driver?.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm text-gray-600">{booking.driver?.name}</p>
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
