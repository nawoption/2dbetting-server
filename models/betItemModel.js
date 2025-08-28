const mongoose = require("mongoose");

const betItemSchema = new mongoose.Schema(
    {
        slipId: { type: mongoose.Schema.Types.ObjectId, ref: "BetSlip", required: true },
        number: { type: String, required: true }, // "30"
        amount: { type: Number, required: true },
        winAmount: { type: Number, default: 0 },
        status: { type: String, enum: ["PENDING", "WON", "LOST"], default: "PENDING" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BetItem", betItemSchema);
