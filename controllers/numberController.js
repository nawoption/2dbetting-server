const Twod = require("../models/numberTwodModel");
const Threed = require("../models/numberThreedModel");
const Fourd = require("../models/numberFourdModel");
const Session = require("../models/sessionModel");

// ✅ Get numbers by sessionId
exports.getNumbersBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Find session first
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        let numbers = [];

        // Pick correct model based on session type
        if (session.sessionType === "2D") {
            numbers = await Twod.find({ sessionId }).select("number totalAmount");
        } else if (session.sessionType === "3D") {
            numbers = await Threed.find({ sessionId }).select("number totalAmount");
        } else if (session.sessionType === "4D") {
            numbers = await Fourd.find({ sessionId }).select("number totalAmount");
        } else {
            return res.status(400).json({ message: "Invalid session type" });
        }

        if (!numbers || numbers.length === 0) {
            return res.status(404).json({ message: "No numbers found for this session" });
        }

        res.status(200).json({
            session,
            totalNumbers: numbers.length,
            numbers,
        });
    } catch (error) {
        console.error("Error fetching numbers:", error);
        res.status(500).json({ message: "Server error" });
    }
};
