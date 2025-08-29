const PaymentMethod = require("../models/paymentMethodModel");

const paymentMethodController = {
    createPaymentMethod: async (req, res) => {
        try {
            const { bankName, bankIcon, accountName, accountNumber, minAmount, maxAmount } = req.body;

            const newPaymentMethod = new PaymentMethod({
                bankName,
                bankIcon,
                accountName,
                accountNumber,
                minAmount,
                maxAmount,
            });

            await newPaymentMethod.save();
            res.status(201).json({ message: "Payment method created successfully", paymentMethod: newPaymentMethod });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    getActivePaymentMethods: async (req, res) => {
        try {
            const activePaymentMethods = await PaymentMethod.find({ isActive: true });
            res.status(200).json(activePaymentMethods);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    getAllPaymentMethods: async (req, res) => {
        try {
            const paymentMethods = await PaymentMethod.find();
            res.status(200).json(paymentMethods);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    getPaymentMethodById: async (req, res) => {
        try {
            const { id } = req.params;
            const paymentMethod = await PaymentMethod.findById(id);
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json(paymentMethod);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    updatePaymentMethod: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedPaymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json({
                message: "Payment method updated successfully",
                paymentMethod: updatedPaymentMethod,
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    deletePaymentMethod: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(id);
            if (!deletedPaymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json({ message: "Payment method deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
    togglePaymentMethodStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const paymentMethod = await PaymentMethod.findById(id);
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            paymentMethod.isActive = !paymentMethod.isActive;
            await paymentMethod.save();
            res.status(200).json({ message: "Payment method status toggled successfully", paymentMethod });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },
};

module.exports = paymentMethodController;
