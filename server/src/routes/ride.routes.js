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
router.get("/:id", getRideById);

// passenger and driver can access
router.use(protect);

// driver only
router.post("/create", restrictTo("driver"), createRide);
router.get("/driver/my-rides", restrictTo("driver"), getMyRides);
router.put("/:id/cancel", restrictTo("driver"), cancelRide);
router.put("/:id/update", restrictTo("driver"), updateRide);

export default router;
