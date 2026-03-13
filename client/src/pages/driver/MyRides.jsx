import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import Spinner from "../../components/shared/Spinner.jsx";
import api from "../../api/axios.js";

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-600",
};

const MyRides = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/rides/driver/my-rides").then((res) => {
      setRides(res.data.rides);
      setLoading(false);
    });
  }, []);

  const cancelRide = async (id) => {
    try {
      await api.put(`/rides/${id}/cancel`);
      setRides((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Rides</h1>
          <button onClick={() => navigate("/post-ride")} className="btn-primary">
            Post New Ride
          </button>
        </div>

        {rides.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="font-medium">No rides posted yet</p>
            <button onClick={() => navigate("/post-ride")}
              className="mt-3 text-primary-600 hover:underline text-sm">
              Post your first ride
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride._id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900">
                        {ride.source.name} → {ride.destination.name}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[ride.status]}`}>
                        {ride.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(ride.departureTime).toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {ride.availableSeats}/{ride.totalSeats} seats available · Rs.{ride.pricePerSeat}/seat
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {ride.status === "scheduled" && (
                      <button onClick={() => cancelRide(ride._id)}
                        className="text-sm text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:text-red-700">
                        Cancel
                      </button>
                    )}
                  </div>
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
