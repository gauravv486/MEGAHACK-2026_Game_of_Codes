import TokenWallet from "../models/TokenWallet.js";
import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";
import crypto from "crypto";

// @GET /api/rewards/wallet
// get user's token wallet
export const getWallet = async (req, res) => {
    try {
        let wallet = await TokenWallet.findOne({ userId: req.user._id });

        if (!wallet) {
            wallet = await TokenWallet.create({ userId: req.user._id });
        }

        res.status(200).json({
            success: true,
            wallet: {
                balance: wallet.balance,
                totalEarned: wallet.totalEarned,
                totalRedeemed: wallet.totalRedeemed,
                transactions: wallet.transactions
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .slice(0, 50),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/rewards/redeem
// redeem tokens for a coupon
export const redeemCoupon = async (req, res) => {
    try {
        const wallet = await TokenWallet.findOne({ userId: req.user._id });

        if (!wallet) {
            return res.status(404).json({ success: false, message: "Wallet not found." });
        }

        // 500 tokens = ₹200 discount coupon
        const REDEEM_COST = 500;
        const COUPON_VALUE = 200;

        if (wallet.balance < REDEEM_COST) {
            return res.status(400).json({
                success: false,
                message: `Need ${REDEEM_COST} tokens. You have ${wallet.balance}.`,
            });
        }

        const couponCode = "SEAT" + crypto.randomBytes(4).toString("hex").toUpperCase();

        wallet.balance -= REDEEM_COST;
        wallet.totalRedeemed += REDEEM_COST;
        wallet.transactions.push({
            type: "redeemed",
            amount: REDEEM_COST,
            description: `Redeemed ₹${COUPON_VALUE} coupon: ${couponCode}`,
            couponCode,
        });

        await wallet.save();

        res.status(200).json({
            success: true,
            message: `Coupon redeemed! Code: ${couponCode}`,
            coupon: {
                code: couponCode,
                value: COUPON_VALUE,
                tokensSpent: REDEEM_COST,
            },
            newBalance: wallet.balance,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Internal: award tokens when a ride completes
// Called from booking controller — 1 token per 10 km
export const awardTokensForRide = async (userId, rideId, distanceKm) => {
    try {
        const tokens = Math.max(1, Math.floor(distanceKm / 10));

        let wallet = await TokenWallet.findOne({ userId });
        if (!wallet) {
            wallet = await TokenWallet.create({ userId });
        }

        wallet.balance += tokens;
        wallet.totalEarned += tokens;
        wallet.transactions.push({
            type: "earned",
            amount: tokens,
            description: `Earned ${tokens} tokens for ${distanceKm} km ride`,
            rideId,
        });

        await wallet.save();
        return tokens;
    } catch (error) {
        console.error("Token award failed:", error.message);
        return 0;
    }
};
