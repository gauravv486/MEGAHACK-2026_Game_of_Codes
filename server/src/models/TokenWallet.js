import mongoose from "mongoose";

const tokenWalletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        balance: { type: Number, default: 0, min: 0 },
        totalEarned: { type: Number, default: 0 },
        totalRedeemed: { type: Number, default: 0 },
        transactions: [
            {
                type: {
                    type: String,
                    enum: ["earned", "redeemed"],
                    required: true,
                },
                amount: { type: Number, required: true },
                description: { type: String, default: "" },
                rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", default: null },
                couponCode: { type: String, default: null },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const TokenWallet = mongoose.model("TokenWallet", tokenWalletSchema);
export default TokenWallet;
