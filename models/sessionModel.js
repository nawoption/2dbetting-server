const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        date: { type: String, required: true },
        // sessionType: { type: String, enum: ["930AM", "12AM", "TW", "2PM", "430PM", "3D", "4D"], required: true },
        sessionType: { type: String, enum: ["2D", "3D", "4D"], required: true },
        limitPerNumber: { type: Number, required: true, default: 10000 },
        resultNumber: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
