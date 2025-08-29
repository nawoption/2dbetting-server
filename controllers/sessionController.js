const Session = require("../models/sessionModel");
const NumberTwod = require("../models/numberTwodModel");
const NumberThreed = require("../models/numberThreedModel");
const NumberFourd = require("../models/numberFourdModel");

const VALID_2D_NAMES = ["930AM", "12AM", "TW", "2PM", "430PM"];

const sessionController = {
    // 🔹 Create 2D Session
    async createSession2D(req, res) {
        try {
            const { date, sessionName, limitPerNumber } = req.body;

            if (!VALID_2D_NAMES.includes(sessionName)) {
                return res.status(400).json({ message: "Invalid sessionName for 2D" });
            }

            const exists = await Session.findOne({ date, sessionName, sessionType: "2D" });
            if (exists) {
                return res.status(400).json({ message: "2D Session already exists for this date and name" });
            }

            const newSession = await Session.create({
                date,
                sessionName,
                sessionType: "2D",
                limitPerNumber,
            });

            let numbers = [];
            for (let i = 0; i < 100; i++) {
                numbers.push({
                    sessionId: newSession._id,
                    number: i.toString().padStart(2, "0"),
                });
            }
            await NumberTwod.insertMany(numbers);

            res.status(201).json({
                message: "2D Session created successfully",
                session: newSession,
                numbersGenerated: numbers.length,
            });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Create 3D Session
    async createSession3D(req, res) {
        try {
            const { date, sessionName, limitPerNumber } = req.body;

            if (sessionName !== "3D") {
                return res.status(400).json({ message: "SessionName for 3D must be '3D'" });
            }

            const exists = await Session.findOne({ date, sessionName, sessionType: "3D" });
            if (exists) {
                return res.status(400).json({ message: "3D Session already exists for this date" });
            }

            const newSession = await Session.create({
                date,
                sessionName,
                sessionType: "3D",
                limitPerNumber,
            });

            let numbers = [];
            for (let i = 0; i < 1000; i++) {
                numbers.push({
                    sessionId: newSession._id,
                    number: i.toString().padStart(3, "0"),
                });
            }
            await NumberThreed.insertMany(numbers);

            res.status(201).json({
                message: "3D Session created successfully",
                session: newSession,
                numbersGenerated: numbers.length,
            });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Create 4D Session
    async createSession4D(req, res) {
        try {
            const { date, sessionName, limitPerNumber } = req.body;

            if (sessionName !== "4D") {
                return res.status(400).json({ message: "SessionName for 4D must be '4D'" });
            }

            const exists = await Session.findOne({ date, sessionName, sessionType: "4D" });
            if (exists) {
                return res.status(400).json({ message: "4D Session already exists for this date" });
            }

            const newSession = await Session.create({
                date,
                sessionName,
                sessionType: "4D",
                limitPerNumber,
            });

            let numbers = [];
            for (let i = 0; i < 10000; i++) {
                numbers.push({
                    sessionId: newSession._id,
                    number: i.toString().padStart(4, "0"),
                });
            }
            await NumberFourd.insertMany(numbers);

            res.status(201).json({
                message: "4D Session created successfully",
                session: newSession,
                numbersGenerated: numbers.length,
            });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    // 🔹 Common Session Endpoints
    async getSessions(req, res) {
        try {
            const { date, sessionType, page = 1, limit = 10 } = req.query;
            const filter = {};
            if (date) filter.date = date;
            if (sessionType) filter.sessionType = sessionType;

            const sessions = await Session.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await Session.countDocuments(filter);

            res.status(200).json({
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
                data: sessions,
            });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    async getSessionById(req, res) {
        try {
            const { id } = req.params;
            const session = await Session.findById(id);
            if (!session) return res.status(404).json({ message: "Session not found" });

            res.status(200).json(session);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    async updateResult(req, res) {
        try {
            const { id } = req.params;
            const { resultNumber } = req.body;

            if (!resultNumber) {
                return res.json(404).json({ message: "Result number can't be empty" });
            }

            const session = await Session.findById(id);
            if (!session) return res.status(404).json({ message: "Session not found" });

            session.resultNumber = resultNumber;
            await session.save();

            res.status(200).json({ message: "Result updated successfully", session });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },

    async deleteSession(req, res) {
        try {
            const { id } = req.params;
            const session = await Session.findById(id);
            if (!session) return res.status(404).json({ message: "Session not found" });

            await Session.findByIdAndDelete(id);

            if (session.sessionType === "2D") {
                await NumberTwod.deleteMany({ sessionId: id });
            } else if (session.sessionType === "3D") {
                await NumberThreed.deleteMany({ sessionId: id });
            } else if (session.sessionType === "4D") {
                await NumberFourd.deleteMany({ sessionId: id });
            }

            res.status(200).json({ message: "Session and related numbers deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    },
};

module.exports = sessionController;
