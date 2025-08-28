const Joi = require("joi");

const createUserSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("USER", "ADMIN"),
    walletBalance: Joi.number().min(0),
    status: Joi.string().valid("ACTIVE", "INACTIVE", "BANNED"),
});

const updateUserSchema = Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    role: Joi.string().valid("USER", "ADMIN"),
    walletBalance: Joi.number().min(0),
    status: Joi.string().valid("ACTIVE", "INACTIVE", "BANNED"),
});

module.exports = { createUserSchema, updateUserSchema };
