const mongoose = require("mongoose");

const cashOutSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
        amount: { type: Number, required: true },
        receiverAccountNumber: { type: String, required: true },
        receiverAccountName: { type: String, required: true },
        status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CashOut", cashOutSchema);
