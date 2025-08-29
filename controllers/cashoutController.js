const CashOut = require("../models/cashoutModel");
const User = require("../models/userModel");
const PaymentMethod = require("../models/paymentMethodModel");

const cashoutController = {
    // 🔹 User: Request CashOut
    async createCashOut(req, res) {
        try {
            const { paymentMethodId, amount, receiverAccountNumber, receiverAccountName } = req.body;

            const paymentMethod = await PaymentMethod.findById(paymentMethodId);
            if (!paymentMethod || !paymentMethod.isActive) {
                return res.status(400).json({ message: "Invalid or inactive payment method" });
            }

            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ message: "User not found" });

            if (amount <= 0 || amount > user.walletBalance) {
                return res.status(400).json({ message: "Invalid withdrawal amount" });
            }

            // Deduct balance immediately (hold funds)
            user.walletBalance -= amount;
            await user.save();

            const newCashOut = await CashOut.create({
                userId: req.user._id,
                paymentMethodId,
                amount,
                receiverAccountNumber,
                receiverAccountName,
            });

            res.status(201).json({ message: "Cash-out request submitted successfully", data: newCashOut });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 User: View Own CashOut Requests
    async getMyCashOuts(req, res) {
        try {
            const cashOuts = await CashOut.find({ userId: req.user._id })
                .populate("paymentMethodId", "bankName accountName accountNumber")
                .sort({ createdAt: -1 });

            res.status(200).json(cashOuts);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 User: View Own CashOut Request detail
    async getMyCashOutById(req, res) {
        try {
            const { id } = req.params;
            const cashOut = await CashOut.findOne({ _id: id, userId: req.user._id })
                .populate("paymentMethodId", "bankName accountName accountNumber")
                .populate("userId", "name phone");

            if (!cashOut) return res.status(404).json({ message: "Cash-out request not found" });

            res.status(200).json(cashOut);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Admin: Get All CashOut Requests (with filters & pagination)
    async getAllCashOuts(req, res) {
        try {
            const { status, userId, page = 1, limit = 10 } = req.query;
            const filter = {};

            if (status) filter.status = status;
            if (userId) filter.userId = userId;

            const cashOuts = await CashOut.find(filter)
                .populate("userId", "name phone")
                .populate("paymentMethodId", "bankName accountName accountNumber")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await CashOut.countDocuments(filter);

            res.status(200).json({
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
                data: cashOuts,
            });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Admin: Approve CashOut
    async approveCashOut(req, res) {
        try {
            const { id } = req.params;
            const cashOut = await CashOut.findById(id);

            if (!cashOut) return res.status(404).json({ message: "Cash-out request not found" });
            if (cashOut.status !== "PENDING") return res.status(400).json({ message: "Cash-out already processed" });

            cashOut.status = "APPROVED";
            await cashOut.save();

            res.status(200).json({ message: "Cash-out approved successfully", data: cashOut });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Admin: Reject CashOut (refund balance)
    async rejectCashOut(req, res) {
        try {
            const { id } = req.params;
            const cashOut = await CashOut.findById(id);

            if (!cashOut) return res.status(404).json({ message: "Cash-out request not found" });
            if (cashOut.status !== "PENDING") return res.status(400).json({ message: "Cash-out already processed" });

            // Refund wallet balance
            const user = await User.findById(cashOut.userId);
            if (user) {
                user.walletBalance += cashOut.amount;
                await user.save();
            }

            cashOut.status = "REJECTED";
            await cashOut.save();

            res.status(200).json({ message: "Cash-out rejected and amount refunded", data: cashOut });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },
};

module.exports = cashoutController;
