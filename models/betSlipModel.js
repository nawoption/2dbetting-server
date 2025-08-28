const mongoose = require("mongoose");

const betSlipSchema = new mongoose.Schema(
    {
        slipCode: { type: String, required: true, unique: true },
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
        sessionType: { type: String, enum: ["2D", "3D", "4D"], required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        totalAmount: { type: Number, required: true },
        winAmount: { type: Number, default: 0 },
        status: { type: String, enum: ["PENDING", "WON", "LOST"], default: "PENDING" },
        cashback: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BetSlip", betSlipSchema);
