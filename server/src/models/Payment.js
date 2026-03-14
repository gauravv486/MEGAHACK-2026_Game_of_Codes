import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: { type: Number, required: true },
        method: {
            type: String,
            enum: ["card", "upi", "cash"],
            default: "card",
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed", "refunded"],
            default: "pending",
        },
        transactionId: { type: String, required: true, unique: true },
        cardLast4: { type: String, default: null },
        upiId: { type: String, default: null },
        paidAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
