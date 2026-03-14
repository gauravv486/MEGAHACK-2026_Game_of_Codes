import express from "express";
import { getWallet, redeemCoupon } from "../controllers/reward.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/wallet", getWallet);
router.post("/redeem", redeemCoupon);

export default router;
