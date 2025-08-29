const Joi = require("joi");

const createCashInSchema = Joi.object({
    paymentMethodId: Joi.string().required(),
    amount: Joi.number().min(100).required(),
    senderAccountNumber: Joi.string().required(),
    senderAccountName: Joi.string().required(),
    lastSixDigit: Joi.string().length(6).required(),
    sendPaymentTime: Joi.string().required(),
});

module.exports = { createCashInSchema };
