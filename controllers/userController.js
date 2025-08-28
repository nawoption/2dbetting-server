const User = require("../models/userModel");

const userController = {
    // ------------------- GET ALL USERS (Filter, Search, Pagination) -------------------
    getAllUsers: async (req, res) => {
        try {
            let { page, limit, search, role, status } = req.query;

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const skip = (page - 1) * limit;

            // build query
            let query = {};
            if (search) {
                query.$or = [{ name: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }];
            }
            if (role) query.role = role;
            if (status) query.status = status;

            const total = await User.countDocuments(query);
            const users = await User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

            res.status(200).json({
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                users,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ------------------- GET SINGLE USER -------------------
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ------------------- UPDATE USER -------------------
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, phone, role, status } = req.body;

            const updatedUser = await User.findByIdAndUpdate(
                id,
                { name, phone, role, status },
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User updated successfully", user: updatedUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // ------------------- DELETE USER -------------------
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },
};

module.exports = userController;
