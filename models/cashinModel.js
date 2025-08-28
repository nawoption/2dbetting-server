const mongoose = require("mongoose");

const cashInSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
        amount: { type: Number, required: true },
        senderAccountNumber: { type: String, required: true },
        senderAccountName: { type: String, required: true },
        lastSixDigit: { type: String, required: true }, // from screenshot
        sendPaymentTime: { type: String, required: true },
        status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CashIn", cashInSchema);
