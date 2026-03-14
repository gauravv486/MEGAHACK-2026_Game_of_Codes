import express from "express";
import { triggerSOS, getAllSOS, resolveSOS } from "../controllers/sos.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

// Any logged-in user can trigger SOS
router.post("/", protect, triggerSOS);

// Admin-only routes
router.get("/", protect, restrictTo("admin"), getAllSOS);
router.put("/:id/resolve", protect, restrictTo("admin"), resolveSOS);

export default router;
