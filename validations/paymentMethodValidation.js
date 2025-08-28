const Joi = require("joi");

const createPaymentMethodSchema = Joi.object({
    bankName: Joi.string().required(),
    bankIcon: Joi.string().uri().allow(null, ""),
    accountName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    minAmount: Joi.number().min(0),
    maxAmount: Joi.number().min(0),
    isActive: Joi.boolean(),
});

const updatePaymentMethodSchema = Joi.object({
    bankName: Joi.string(),
    bankIcon: Joi.string().uri(),
    accountName: Joi.string(),
    accountNumber: Joi.string(),
    minAmount: Joi.number(),
    maxAmount: Joi.number(),
    isActive: Joi.boolean(),
});

module.exports = { createPaymentMethodSchema, updatePaymentMethodSchema };
