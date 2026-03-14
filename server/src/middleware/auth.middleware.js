import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token = req.cookies.accessToken;

        // fallback: check Authorization header
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select(
            "-password -refreshToken"
        );

        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        if (!req.user.isActive) {
            return res.status(403).json({ success: false, message: "Account deactivated." });
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired.",
                code: "TOKEN_EXPIRED",
            });
        }
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
};
