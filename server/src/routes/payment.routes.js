import express from "express";
import { processPayment, getPaymentByBooking } from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/pay", processPayment);
router.get("/booking/:bookingId", getPaymentByBooking);

export default router;
