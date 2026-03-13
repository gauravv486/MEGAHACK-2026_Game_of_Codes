import express from "express";
import {
    createRide,
    searchRides,
    getRideById,
    getMyRides,
    cancelRide,
    updateRide,
} from "../controllers/ride.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

// public routes
router.get("/search", searchRides);

// protected routes — must come before /:id
router.use(protect);

// driver only — these must sit ABOVE the /:id catch-all
router.post("/create", restrictTo("driver"), createRide);
router.get("/driver/my-rides", restrictTo("driver"), getMyRides);
router.put("/:id/cancel", restrictTo("driver"), cancelRide);
router.put("/:id/update", restrictTo("driver"), updateRide);

// this is the catch-all — keep last
router.get("/:id", getRideById);

export default router;
