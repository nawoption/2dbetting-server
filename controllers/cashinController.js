const CashIn = require("../models/cashinModel");
const User = require("../models/userModel");
const PaymentMethod = require("../models/paymentMethodModel");

const cashinController = {
    // 🔹 User: Create CashIn Request
    async createCashIn(req, res) {
        try {
            const { paymentMethodId, amount, senderAccountNumber, senderAccountName, lastSixDigit, sendPaymentTime } =
                req.body;

            const paymentMethod = await PaymentMethod.findById(paymentMethodId);
            if (!paymentMethod || !paymentMethod.isActive) {
                return res.status(400).json({ message: "Invalid or inactive payment method" });
            }

            if (amount < paymentMethod.minAmount || amount > paymentMethod.maxAmount) {
                return res.status(400).json({
                    message: `Amount must be between ${paymentMethod.minAmount} and ${paymentMethod.maxAmount}`,
                });
            }

            const newCashIn = await CashIn.create({
                userId: req.user._id,
                paymentMethodId,
                amount,
                senderAccountNumber,
                senderAccountName,
                lastSixDigit,
                sendPaymentTime,
            });

            res.status(201).json({ message: "Cash-in request submitted successfully", data: newCashIn });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 User: View Own CashIn Requests
    async getMyCashIns(req, res) {
        try {
            const cashIns = await CashIn.find({ userId: req.user._id })
                .populate("paymentMethodId", "bankName accountName accountNumber")
                .sort({ createdAt: -1 });

            res.status(200).json(cashIns);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 User: View Own CashIn Request detail
    async getMyCashInById(req, res) {
        try {
            const cashIn = await CashIn.findById(req.params.id)
                .populate("paymentMethodId", "bankName accountName accountNumber")
                .populate("userId", "name phone");
            if (!cashIn) return res.status(404).json({ message: "Cash-in request not found" });
            res.status(200).json(cashIn);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Admin: Get All CashIn Requests (with filtering & pagination)
    async getAllCashIns(req, res) {
        try {
            const { status, userId, page = 1, limit = 10 } = req.query;
            const filter = {};

            if (status) filter.status = status;
            if (userId) filter.userId = userId;

            const cashIns = await CashIn.find(filter)
                .populate("userId", "name phone")
                .populate("paymentMethodId", "bankName accountName accountNumber")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await CashIn.countDocuments(filter);

            res.status(200).json({
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
                data: cashIns,
            });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Admin: Approve CashIn
    async approveCashIn(req, res) {
        try {
            const { id } = req.params;
            const cashIn = await CashIn.findById(id);

            if (!cashIn) return res.status(404).json({ message: "Cash-in request not found" });
            if (cashIn.status !== "PENDING") return res.status(400).json({ message: "Cash-in already processed" });

            // Update wallet balance
            const user = await User.findById(cashIn.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.walletBalance += cashIn.amount;
            await user.save();

            cashIn.status = "APPROVED";
            await cashIn.save();

            res.status(200).json({ message: "Cash-in approved successfully", data: cashIn });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Admin: Reject CashIn
    async rejectCashIn(req, res) {
        try {
            const { id } = req.params;
            const cashIn = await CashIn.findById(id);

            if (!cashIn) return res.status(404).json({ message: "Cash-in request not found" });
            if (cashIn.status !== "PENDING") return res.status(400).json({ message: "Cash-in already processed" });

            cashIn.status = "REJECTED";
            await cashIn.save();

            res.status(200).json({ message: "Cash-in rejected", data: cashIn });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },
};

module.exports = cashinController;
