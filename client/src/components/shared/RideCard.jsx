import { useNavigate } from "react-router-dom";

const RideCard = ({ ride }) => {
  const navigate = useNavigate();

  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/rides/${ride._id}`)}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-center">
              <p className="font-semibold text-gray-900">{ride.source.name}</p>
              <p className="text-xs text-gray-500">{ride.source.address}</p>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-gray-400 text-xs">
                {ride.distanceKm ? `${ride.distanceKm} km` : ""}
              </span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{ride.destination.name}</p>
              <p className="text-xs text-gray-500">{ride.destination.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              {new Date(ride.departureTime).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </span>
            <span>
              {new Date(ride.departureTime).toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
            <span>{ride.availableSeats} seats left</span>
          </div>
        </div>

        <div className="ml-4 text-right">
          <p className="text-2xl font-bold text-primary-600">
            Rs.{ride.pricePerSeat}
          </p>
          <p className="text-xs text-gray-500">per seat</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {ride.driver?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{ride.driver?.name}</p>
            <p className="text-xs text-gray-500">
              {ride.driver?.averageRating > 0
                ? `${ride.driver.averageRating} rating`
                : "New driver"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 text-xs">
          {ride.preferences?.smokingAllowed === false && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">No Smoking</span>
          )}
          {ride.preferences?.petsAllowed && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Pets OK</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideCard;
