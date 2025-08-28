const Joi = require("joi");

const createCashOutSchema = Joi.object({
    userId: Joi.string().required(),
    paymentMethodId: Joi.string().required(),
    amount: Joi.number().min(100).required(),
    receiverAccountNumber: Joi.string().required(),
    receiverAccountName: Joi.string().required(),
});

module.exports = { createCashOutSchema };
