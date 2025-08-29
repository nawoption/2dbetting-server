const Joi = require("joi");

const createSessionSchema = Joi.object({
    date: Joi.string()
        .required()
        .pattern(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD format
        .messages({
            "string.pattern.base": "Date must be in YYYY-MM-DD format",
        }),
    sessionName: Joi.string().valid("930AM", "12AM", "TW", "2PM", "430PM", "3D", "4D").required(),
    limitPerNumber: Joi.number().integer().min(1).default(10000),
    resultNumber: Joi.string()
        .allow(null, "")
        .when("sessionType", {
            is: "2D",
            then: Joi.string()
                .length(2)
                .pattern(/^\d{2}$/)
                .allow(null, ""),
        })
        .when("sessionType", {
            is: "3D",
            then: Joi.string()
                .length(3)
                .pattern(/^\d{3}$/)
                .allow(null, ""),
        })
        .when("sessionType", {
            is: "4D",
            then: Joi.string()
                .length(4)
                .pattern(/^\d{4}$/)
                .allow(null, ""),
        }),
});

module.exports = { createSessionSchema };
