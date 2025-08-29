const Joi = require("joi");
const mongoose = require("mongoose");

// custom validator for ObjectId
const objectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid ObjectId");
    }
    return value;
};

const betSlipSchema = Joi.object({
    sessionId: Joi.string().custom(objectId).required(),
    bets: Joi.array()
        .items(
            Joi.object({
                number: Joi.string().required(), // keep flexible for 2D/3D/4D
                amount: Joi.number().integer().min(50).required(),
            })
        )
        .min(1)
        .required(),
});

module.exports = { betSlipSchema };
