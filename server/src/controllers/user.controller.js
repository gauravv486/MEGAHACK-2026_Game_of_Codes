import User from "../models/User.js";
import DriverProfile from "../models/DriverProfile.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const driverOnboarding = async (req, res) => {
  try {
    const {
      make, model, color, year,
      registrationNumber, totalSeats,
      licenseNumber, preferences,
    } = req.body;

    // safely parse preferences — could be undefined, a string, or already an object
    let parsedPrefs = {};
    if (preferences) {
      parsedPrefs = typeof preferences === "string" ? JSON.parse(preferences) : preferences;
    }

    const profile = await DriverProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        vehicle: { make, model, color, year, registrationNumber, totalSeats },
        licenseNumber,
        preferences: parsedPrefs,
        verificationStatus: "pending",
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Onboarding submitted. Under review.",
      profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDriverProfile = async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({
      userId: req.user._id,
    }).populate("userId", "name email phone avatar trustScore");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found.",
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
