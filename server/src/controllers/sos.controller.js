import SOS from "../models/SOS.js";

// POST /api/sos — any logged-in user can trigger
export const triggerSOS = async (req, res) => {
  try {
    const { message, latitude, longitude } = req.body;

    const sos = await SOS.create({
      user: req.user._id,
      message: message || "Emergency SOS triggered",
      location: { latitude, longitude },
    });

    const populated = await sos.populate("user", "name email phone role");

    res.status(201).json({ success: true, sos: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sos — admin only
export const getAllSOS = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const alerts = await SOS.find(filter)
      .populate("user", "name email phone role")
      .populate("resolvedBy", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/sos/:id/resolve — admin only
export const resolveSOS = async (req, res) => {
  try {
    const { status } = req.body; // "resolved" or "dismissed"

    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      {
        status: status || "resolved",
        resolvedBy: req.user._id,
        resolvedAt: new Date(),
      },
      { new: true }
    )
      .populate("user", "name email phone role")
      .populate("resolvedBy", "name");

    if (!sos) {
      return res.status(404).json({ success: false, message: "SOS not found" });
    }

    res.json({ success: true, sos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
