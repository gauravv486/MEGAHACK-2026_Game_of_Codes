import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userSocketMap = {};

export const getSocketId = (userId) => userSocketMap[userId.toString()];

const initSocket = (io) => {

    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.token;

            if (!token) return next(new Error("Authentication token missing."));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select(
                "-password -refreshToken"
            );

            if (!user) return next(new Error("User not found."));

            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Invalid or expired token."));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user._id.toString();
        userSocketMap[userId] = socket.id;

        console.log(`User connected: ${socket.user.name} | socket: ${socket.id}`);

        io.emit("user:online", { userId });

        socket.on("ride:join", ({ rideId }) => {
            socket.join(`ride:${rideId}`);
        });

        socket.on("ride:leave", ({ rideId }) => {
            socket.leave(`ride:${rideId}`);
        });

        socket.on("driver:location", ({ rideId, latitude, longitude }) => {
            socket.to(`ride:${rideId}`).emit("driver:location:update", {
                rideId,
                latitude,
                longitude,
                timestamp: new Date(),
            });
        });

        socket.on("ride:status", ({ rideId, status }) => {
            io.to(`ride:${rideId}`).emit("ride:status:update", {
                rideId,
                status,
                updatedAt: new Date(),
            });
        });

        socket.on("message:send", ({ rideId, message }) => {
            io.to(`ride:${rideId}`).emit("message:receive", {
                rideId,
                senderId: socket.user._id,
                senderName: socket.user.name,
                senderAvatar: socket.user.avatar,
                message,
                sentAt: new Date(),
            });
        });

        socket.on("sos:trigger", ({ rideId, latitude, longitude }) => {
            const payload = {
                rideId,
                triggeredBy: { userId: socket.user._id, name: socket.user.name },
                latitude,
                longitude,
                triggeredAt: new Date(),
            };
            io.to(`ride:${rideId}`).emit("sos:alert", payload);
            io.to("admin:room").emit("sos:alert", payload);
        });

        socket.on("booking:notify_driver", ({ driverId, bookingData }) => {
            const driverSocketId = getSocketId(driverId);
            if (driverSocketId) {
                io.to(driverSocketId).emit("booking:new_request", bookingData);
            }
        });

        socket.on("booking:notify_passenger", ({ passengerId, status, bookingData }) => {
            const passengerSocketId = getSocketId(passengerId);
            if (passengerSocketId) {
                io.to(passengerSocketId).emit("booking:response", { status, bookingData });
            }
        });

        socket.on("admin:join", () => {
            if (socket.user.role === "admin") {
                socket.join("admin:room");
            }
        });

        socket.on("disconnect", () => {
            delete userSocketMap[userId];
            io.emit("user:offline", { userId });
            console.log(`User disconnected: ${socket.user.name}`);
        });
    });
};

export default initSocket;
