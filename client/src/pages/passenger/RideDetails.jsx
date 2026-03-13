import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import useRideStore from "../../store/useRideStore.js";
import useAuthStore from "../../store/useAuthStore.js";
import api from "../../api/axios.js";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRide, loading, getRideById } = useRideStore();
  const { user } = useAuthStore();
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => {
    getRideById(id);
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate("/login");
    setBooking(true);
    try {
      await api.post("/bookings/create", {
        rideId: id,
        seatsBooked: seats,
        paymentMethod: "cash",
      });
      setBookingMsg("Booking request sent. Waiting for driver confirmation.");
    } catch (err) {
      setBookingMsg(err.response?.data?.message || "Booking failed.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!currentRide) return <div className="min-h-screen flex items-center justify-center text-gray-500">Ride not found.</div>;

  const ride = currentRide;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)}
          className="text-sm text-primary-600 hover:underline mb-4 block">
          Back to results
        </button>

        <div className="card mb-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xl font-bold text-gray-900">{ride.source.name}</p>
                  <p className="text-sm text-gray-500">{ride.source.address}</p>
                </div>
                <div className="text-gray-400 text-lg">→</div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{ride.destination.name}</p>
                  <p className="text-sm text-gray-500">{ride.destination.address}</p>
                </div>
              </div>
              <p className="text-gray-600 mt-3 text-sm">
                {new Date(ride.departureTime).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">Rs.{ride.pricePerSeat}</p>
              <p className="text-xs text-gray-500">per seat</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100 text-sm text-center">
            <div>
              <p className="font-medium text-gray-900">{ride.availableSeats}</p>
              <p className="text-gray-500">Seats left</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">{ride.distanceKm || "—"} km</p>
              <p className="text-gray-500">Distance</p>
            </div>
            <div>
              <p className="font-medium text-green-600">{ride.co2SavedPerPassenger || 0} kg</p>
              <p className="text-gray-500">CO2 saved</p>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Driver</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
              {ride.driver?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{ride.driver?.name}</p>
              <p className="text-sm text-gray-500">
                {ride.driver?.averageRating > 0
                  ? `${ride.driver.averageRating} avg rating`
                  : "New driver"} · Trust Score: {ride.driver?.trustScore}
              </p>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Vehicle</h3>
          <p className="text-gray-600 text-sm">
            {ride.vehicle?.make} {ride.vehicle?.model} · {ride.vehicle?.color} · {ride.vehicle?.registrationNumber}
          </p>
        </div>

        {bookingMsg && (
          <div className={`rounded-lg px-4 py-3 mb-4 text-sm ${
            bookingMsg.includes("sent")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {bookingMsg}
          </div>
        )}

        {user?.role === "passenger" && ride.status === "scheduled" && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Book Seats</h3>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm text-gray-600">Number of seats</label>
              <select value={seats} onChange={(e) => setSeats(Number(e.target.value))}
                className="input-field w-24">
                {Array.from({ length: ride.availableSeats }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-gray-600 text-sm">
                Total: <strong>Rs.{ride.pricePerSeat * seats}</strong>
              </span>
            </div>
            <button onClick={handleBook} disabled={booking}
              className="btn-primary w-full">
              {booking ? "Sending request..." : "Request to Book"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetails;
