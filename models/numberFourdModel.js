const mongoose = require("mongoose");

const numberFourdModel = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    number: { type: String, required: true }, // "00" - "99"
    totalAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("NumberFourd", numberFourdModel);
