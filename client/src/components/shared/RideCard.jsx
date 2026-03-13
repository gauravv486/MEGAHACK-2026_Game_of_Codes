import { useNavigate } from "react-router-dom";

const RideCard = ({ ride }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/rides/${ride._id}`)} className="card cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-black text-lg">
            {ride.source?.name}
            <span className="mx-2 text-gray-400">&rarr;</span>
            {ride.destination?.name}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(ride.departureTime).toLocaleString("en-IN", {
              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black">&#8377;{ride.pricePerSeat}</p>
          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">per seat</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="badge badge-green">{ride.availableSeats}/{ride.totalSeats} seats</span>
        {ride.distanceKm > 0 && <span className="badge badge-blue">{ride.distanceKm} km</span>}
      </div>

      {ride.driver && (
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "2px solid #1a1a1a" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center text-xs font-black"
              style={{ background: "#ffe156", border: "2px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}>
              {ride.driver.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold">{ride.driver.name}</span>
            {ride.driver.averageRating > 0 && (
              <span className="text-xs text-gray-500">{ride.driver.averageRating} stars</span>
            )}
          </div>
          {ride.co2SavedPerPassenger > 0 && (
            <span className="badge badge-green text-xs">{ride.co2SavedPerPassenger} kg CO2</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RideCard;
