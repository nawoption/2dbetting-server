const mongoose = require("mongoose");

const numberTwodSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    number: { type: String, required: true }, // "00" - "99"
    totalAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("NumberTwod", numberTwodSchema);
