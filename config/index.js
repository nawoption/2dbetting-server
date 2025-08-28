require("dotenv").config();

const config = {
    env: {
        PORT: process.env.PORT || 3000,
        MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/2d3d_lottery",
        JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
        TWOD_TIMES: process.env.TWOD_TIMES || 85,
        THREED_TIMES: process.env.THREED_TIMES || 600,
    },
};

module.exports = config;
