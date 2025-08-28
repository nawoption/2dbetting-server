const mongoose = require("mongoose");

const numberThreedSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    number: { type: String, required: true }, // "000" - "999"
    totalAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("NumberThreed", numberThreedSchema);
