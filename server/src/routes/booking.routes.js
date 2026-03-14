import express from "express";
import {
    createBooking,
    acceptBooking,
    rejectBooking,
    cancelBooking,
    completeBooking,
    getMyBookings,
    getBookingsForRide,
    rateDriver,
    ratePassenger,
} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

// passenger routes
router.post("/create", restrictTo("passenger"), createBooking);
router.get("/my-bookings", restrictTo("passenger"), getMyBookings);
router.put("/:id/cancel", restrictTo("passenger"), cancelBooking);
router.put("/:id/rate-driver", restrictTo("passenger"), rateDriver);

// driver routes
router.put("/:id/accept", restrictTo("driver"), acceptBooking);
router.put("/:id/reject", restrictTo("driver"), rejectBooking);
router.put("/:id/complete", restrictTo("driver"), completeBooking);
router.get("/ride/:rideId", restrictTo("driver"), getBookingsForRide);
router.put("/:id/rate-passenger", restrictTo("driver"), ratePassenger);

export default router;
