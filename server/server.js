import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import rideRoutes from "./src/routes/ride.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import smartRoutes from "./src/routes/smart.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import rewardRoutes from "./src/routes/reward.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import initSocket from "./src/socket/socket.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

initSocket(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://megahack-2026-game-of-codes.vercel.app"  // Add your Vercel URL
  ],
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/smart", smartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "RideShare API running" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
