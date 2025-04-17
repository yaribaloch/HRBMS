const Joi = require("@hapi/joi");
const { number } = require("joi");

const signupAuthSchema = Joi.object({
    userEmail: Joi.string().email().required(),
    userPassword: Joi.string().min(3).max(10).required(),
    //userID: Joi.number(),
    userName: Joi.string().min(5).max(30).required(),
    //userRole: Joi.string(),
    userContact: Joi.number().required(),
    userBalance: Joi.number()
})
const roomAuthSchema = Joi.object({
    _id: Joi.number().required(),
    roomCategory: Joi.number().valid("Suite", "Deluxe", "Standard").required(),
    roomPrice: Joi.number().required()
})
const bookingAuthSchema = Joi.object({
    bookingStartDate : Joi.date().required(),
    bookingEndDate :Joi.date().required(),
    roomNumbers: Joi.array().items(Joi.string()).required()
})
module.exports = {
    signupAuthSchema,
    roomAuthSchema,
    bookingAuthSchema
}