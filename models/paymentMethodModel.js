const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
    {
        bankName: { type: String, required: true },
        bankIcon: { type: String, default: null }, // URL or file path
        accountName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        minAmount: { type: Number, default: 0 },
        maxAmount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
