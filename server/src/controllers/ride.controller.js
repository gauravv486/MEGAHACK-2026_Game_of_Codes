import Ride from "../models/Ride.js";
import DriverProfile from "../models/DriverProfile.js";
import geocodeCity from "../utils/geocode.js";

// @POST /api/rides/create
// driver creates a new ride — auto-geocodes if no lat/lng
export const createRide = async (req, res) => {
  try {
    const {
      sourceName,
      sourceAddress,
      sourceLng,
      sourceLat,
      destinationName,
      destinationAddress,
      destinationLng,
      destinationLat,
      departureTime,
      estimatedArrivalTime,
      totalSeats,
      pricePerSeat,
      distanceKm,
      preferences,
      description,
      vehicle,
    } = req.body;

    // check if driver is verified
    const driverProfile = await DriverProfile.findOne({
      userId: req.user._id,
    });

    if (!driverProfile || driverProfile.verificationStatus !== "verified") {
      return res.status(403).json({
        success: false,
        message:
          "Your driver profile must be verified before posting a ride.",
      });
    }

    // Auto-geocode source if lat/lng not provided
    let finalSourceLat = sourceLat ? parseFloat(sourceLat) : null;
    let finalSourceLng = sourceLng ? parseFloat(sourceLng) : null;

    if (!finalSourceLat || !finalSourceLng) {
      const geo = await geocodeCity(sourceName);
      if (geo) {
        finalSourceLat = geo.lat;
        finalSourceLng = geo.lng;
      } else {
        // fallback defaults (India center)
        finalSourceLat = 20.5937;
        finalSourceLng = 78.9629;
      }
    }

    // Auto-geocode destination if lat/lng not provided
    let finalDestLat = destinationLat ? parseFloat(destinationLat) : null;
    let finalDestLng = destinationLng ? parseFloat(destinationLng) : null;

    if (!finalDestLat || !finalDestLng) {
      const geo = await geocodeCity(destinationName);
      if (geo) {
        finalDestLat = geo.lat;
        finalDestLng = geo.lng;
      } else {
        finalDestLat = 20.5937;
        finalDestLng = 78.9629;
      }
    }

    // co2 saved estimate: avg car emits 0.21 kg per km, shared with N passengers
    const co2SavedPerPassenger = distanceKm
      ? parseFloat(((0.21 * distanceKm) / totalSeats).toFixed(2))
      : 0;

    const ride = await Ride.create({
      driver: req.user._id,
      source: {
        name: sourceName,
        address: sourceAddress || "",
        coordinates: {
          type: "Point",
          coordinates: [finalSourceLng, finalSourceLat],
        },
      },
      destination: {
        name: destinationName,
        address: destinationAddress || "",
        coordinates: {
          type: "Point",
          coordinates: [finalDestLng, finalDestLat],
        },
      },
      departureTime,
      estimatedArrivalTime: estimatedArrivalTime || null,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(totalSeats),
      pricePerSeat: parseFloat(pricePerSeat),
      distanceKm: parseFloat(distanceKm) || 0,
      preferences: preferences || {},
      description: description || "",
      vehicle: vehicle || driverProfile.vehicle,
      co2SavedPerPassenger,
    });

    res.status(201).json({
      success: true,
      message: "Ride created successfully.",
      ride,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/rides/search
export const searchRides = async (req, res) => {
  try {
    const {
      sourceName,
      destinationName,
      date,
      seats,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { status: "scheduled" };

    if (sourceName) {
      filter["source.name"] = { $regex: sourceName, $options: "i" };
    }

    if (destinationName) {
      filter["destination.name"] = {
        $regex: destinationName,
        $options: "i",
      };
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: startOfDay, $lte: endOfDay };
    } else {
      filter.departureTime = { $gte: new Date() };
    }

    if (seats) {
      filter.availableSeats = { $gte: parseInt(seats) };
    }

    if (minPrice || maxPrice) {
      filter.pricePerSeat = {};
      if (minPrice) filter.pricePerSeat.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerSeat.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const rides = await Ride.find(filter)
      .populate("driver", "name avatar averageRating totalRidesAsDriver trustScore")
      .sort({ departureTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ride.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      rides,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/rides/:id
export const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      "driver",
      "name avatar averageRating totalRidesAsDriver trustScore phone"
    );

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found." });
    }

    res.status(200).json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/rides/driver/my-rides
export const getMyRides = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { driver: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const rides = await Ride.find(filter)
      .sort({ departureTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ride.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      rides,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/rides/:id/cancel
export const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found." });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own rides.",
      });
    }

    if (ride.status === "completed" || ride.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Ride is already ${ride.status}.`,
      });
    }

    ride.status = "cancelled";
    await ride.save();

    res
      .status(200)
      .json({ success: true, message: "Ride cancelled.", ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/rides/:id/update
export const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found." });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own rides.",
      });
    }

    if (ride.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Only scheduled rides can be updated.",
      });
    }

    const allowedFields = [
      "pricePerSeat",
      "departureTime",
      "estimatedArrivalTime",
      "preferences",
      "description",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        ride[field] = req.body[field];
      }
    });

    await ride.save();

    res
      .status(200)
      .json({ success: true, message: "Ride updated.", ride });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
