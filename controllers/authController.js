const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
    // ------------------- REGISTER -------------------
    register: async (req, res) => {
        try {
            const { name, phone, password } = req.body;

            if (!name || !phone || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // check if phone already exists
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                return res.status(400).json({ message: "Phone number already registered" });
            }

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                name,
                phone,
                password: hashedPassword,
            });

            await newUser.save();

            return res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ------------------- LOGIN -------------------
    login: async (req, res) => {
        try {
            const { phone, password } = req.body;

            if (!phone || !password) {
                return res.status(400).json({ message: "Phone and password are required" });
            }

            // find user
            const user = await User.findOne({ phone });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            if (user.status !== "ACTIVE") {
                return res.status(403).json({ message: "Account is not active" });
            }

            // create JWT token
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    walletBalance: user.walletBalance,
                    status: user.status,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },
};

module.exports = authController;
