import User from "../models/User.js";
import DriverProfile from "../models/DriverProfile.js";
import {
    generateAccessToken,
    generateRefreshToken,
    setTokenCookies,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    existingUser.email === email
                        ? "Email already registered."
                        : "Phone already registered.",
            });
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: role || "passenger",
        });

        if (user.role === "driver") {
            await DriverProfile.create({ userId: user._id });
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        setTokenCookies(res, accessToken, refreshToken);

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                trustScore: user.trustScore,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password.",
            });
        }

        const user = await User.findOne({ email }).select("+password +refreshToken");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        setTokenCookies(res, accessToken, refreshToken);

        res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                trustScore: user.trustScore,
                averageRating: user.averageRating,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "No refresh token found." });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId).select("+refreshToken");

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token. Please login again.",
            });
        }

        const newAccessToken = generateAccessToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        setTokenCookies(res, newAccessToken, newRefreshToken);

        res.status(200).json({ success: true, message: "Token refreshed.", accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({
            success: false,
            message: "Token expired or invalid. Please login again.",
        });
    }
};

export const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ success: true, message: "Logged out." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        let driverProfile = null;

        if (user.role === "driver") {
            driverProfile = await DriverProfile.findOne({ userId: user._id });
        }

        res.status(200).json({ success: true, user, driverProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
