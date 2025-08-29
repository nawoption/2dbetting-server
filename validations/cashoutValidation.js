const Joi = require("joi");

const createCashOutSchema = Joi.object({
    paymentMethodId: Joi.string().required(),
    amount: Joi.number().min(100).required(),
    receiverAccountNumber: Joi.string().required(),
    receiverAccountName: Joi.string().required(),
});

module.exports = { createCashOutSchema };
