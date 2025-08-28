const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string()
        .pattern(/^[0-9]{6,15}$/)
        .required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
