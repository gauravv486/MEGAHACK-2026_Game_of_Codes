import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        source: {
            name: { type: String, required: true },
            address: { type: String, default: "" },
            coordinates: {
                type: { type: String, enum: ["Point"], default: "Point" },
                coordinates: { type: [Number], required: true },
            },
        },
        destination: {
            name: { type: String, required: true },
            address: { type: String, default: "" },
            coordinates: {
                type: { type: String, enum: ["Point"], default: "Point" },
                coordinates: { type: [Number], required: true },
            },
        },
        stops: [
            {
                name: { type: String },
                coordinates: {
                    type: { type: String, enum: ["Point"], default: "Point" },
                    coordinates: { type: [Number] },
                },
            },
        ],
        departureTime: { type: Date, required: true },
        estimatedArrivalTime: { type: Date, default: null },
        estimatedDuration: { type: Number, default: 0 },
        distanceKm: { type: Number, default: 0 },
        totalSeats: { type: Number, required: true, min: 1, max: 6 },
        availableSeats: { type: Number, required: true, min: 0 },
        pricePerSeat: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["scheduled", "ongoing", "completed", "cancelled"],
            default: "scheduled",
        },
        bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
        preferences: {
            smokingAllowed: { type: Boolean, default: false },
            petsAllowed: { type: Boolean, default: false },
            musicAllowed: { type: Boolean, default: true },
            luggageAllowed: {
                type: String,
                enum: ["none", "small", "large"],
                default: "small",
            },
        },
        vehicle: {
            make: { type: String, default: "" },
            model: { type: String, default: "" },
            color: { type: String, default: "" },
            registrationNumber: { type: String, default: "" },
        },
        description: { type: String, default: "", maxlength: 300 },
        co2SavedPerPassenger: { type: Number, default: 0 },
    },
    { timestamps: true }
);

rideSchema.index({ "source.coordinates": "2dsphere" });
rideSchema.index({ "destination.coordinates": "2dsphere" });
rideSchema.index({ status: 1, departureTime: 1 });

const Ride = mongoose.model("Ride", rideSchema);
export default Ride;
