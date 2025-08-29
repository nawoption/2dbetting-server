const BetSlip = require("../models/betSlipModel");
const BetItem = require("../models/betItemModel");
const TwodNumber = require("../models/numberTwodModel");
const ThreedNumber = require("../models/numberThreedModel");
const FourdNumber = require("../models/numberFourdModel");
const Session = require("../models/sessionModel");
const User = require("../models/userModel");
const { generateSlipCode } = require("../utils/helper");

exports.createBetSlip = async (req, res) => {
    try {
        const { sessionId, bets } = req.body;
        const userId = req.user._id;
        // bets = [{ number: "30", amount: 100 }, { number: "31", amount: 200 }]

        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ msg: "Session not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const totalAmount = bets.reduce((sum, b) => sum + b.amount, 0);

        // ✅ Wallet balance check
        if (user.walletBalance < totalAmount) {
            return res.status(400).json({
                message: "Insufficient balance",
                walletBalance: user.walletBalance,
                required: totalAmount,
            });
        }

        // Choose number model dynamically
        let NumberModel;
        switch (session.sessionType) {
            case "2D":
                NumberModel = TwodNumber;
                break;
            case "3D":
                NumberModel = ThreedNumber;
                break;
            case "4D":
                NumberModel = FourdNumber;
                break;
            default:
                return res.status(400).json({ msg: "Invalid session type" });
        }

        // ✅ Per number limit check
        for (const bet of bets) {
            const numDoc = await NumberModel.findOne({ sessionId, number: bet.number });
            if (!numDoc) {
                return res.status(400).json({ msg: `Number ${bet.number} not found` });
            }

            const availableAmount = session.limitPerNumber - numDoc.totalAmount;
            if (bet.amount > availableAmount) {
                return res.status(400).json({
                    msg: `Number ${bet.number} limit exceeded`,
                    availableAmount,
                });
            }
        }

        // Create slip
        const slip = new BetSlip({
            slipCode: generateSlipCode(),
            sessionId: session._id,
            sessionType: session.sessionType,
            userId,
            totalAmount: bets.reduce((sum, b) => sum + b.amount, 0),
        });
        await slip.save();

        // Create bet items and update number totals
        for (const bet of bets) {
            await BetItem.create({
                slipId: slip._id,
                number: bet.number,
                amount: bet.amount,
            });

            await NumberModel.updateOne({ sessionId, number: bet.number }, { $inc: { totalAmount: bet.amount } });
        }

        // ✅ Deduct user wallet balance
        user.walletBalance -= totalAmount;
        await user.save();

        return res.status(201).json({
            message: "Bet slip created successfully",
            slipCode: slip.slipCode,
            slipId: slip._id,
            newBalance: user.walletBalance,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getUserSlips = async (req, res) => {
    try {
        const { sessionType } = req.params;

        const slips = await BetSlip.find({ userId: req.user._id, sessionType }).lean();

        res.json({ slips });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getSlipDetails = async (req, res) => {
    try {
        const { slipId } = req.params;

        const slip = await BetSlip.findById(slipId).lean();
        if (!slip) return res.status(404).json({ msg: "Slip not found" });

        const items = await BetItem.find({ slipId }).select("number amount winAmount").lean();

        res.json({ slip, items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};
