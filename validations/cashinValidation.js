const Joi = require("joi");

const createCashInSchema = Joi.object({
    userId: Joi.string().required(),
    paymentMethodId: Joi.string().required(),
    amount: Joi.number().min(100).required(),
    senderAccountNumber: Joi.string().required(),
    senderAccountName: Joi.string().required(),
    lastSixDigit: Joi.string().length(6).required(),
    sendPaymentTimeString: Joi.string().required(),
});

module.exports = { createCashInSchema };
