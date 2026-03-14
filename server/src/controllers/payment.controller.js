import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import crypto from "crypto";

// @POST /api/payments/pay
// process a demo payment for a booking
export const processPayment = async (req, res) => {
    try {
        const { bookingId, method, cardLast4, upiId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required." });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        if (booking.passenger.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        if (booking.paymentStatus === "paid") {
            return res.status(400).json({ success: false, message: "Already paid." });
        }

        // Generate a unique transaction ID
        const transactionId = "TXN" + Date.now() + crypto.randomBytes(4).toString("hex").toUpperCase();

        // Create payment record
        const payment = await Payment.create({
            booking: bookingId,
            user: req.user._id,
            amount: booking.totalPrice,
            method: method || "card",
            status: "success",
            transactionId,
            cardLast4: method === "card" ? (cardLast4 || "4242") : null,
            upiId: method === "upi" ? (upiId || null) : null,
            paidAt: new Date(),
        });

        // Update booking payment status
        booking.paymentStatus = "paid";
        booking.paymentMethod = method === "upi" ? "online" : "online";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Payment successful!",
            payment: {
                transactionId: payment.transactionId,
                amount: payment.amount,
                method: payment.method,
                status: payment.status,
                paidAt: payment.paidAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/payments/booking/:bookingId
// get payment details for a booking
export const getPaymentByBooking = async (req, res) => {
    try {
        const payment = await Payment.findOne({ booking: req.params.bookingId });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found." });
        }

        res.status(200).json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
