const Joi = require("@hapi/joi");
const { number } = require("joi");

const signupAuthSchema = Joi.object({
    userEmail: Joi.string().email().required(),
    userPassword: Joi.string().min(3).max(10).required(),
    userName: Joi.string().min(5).max(30).required(),
    userContact: Joi.number().required(),
    userBalance: Joi.number(),
})
const roomAuthSchema = Joi.object({
    roomCategory: Joi.number().valid("Suite", "Deluxe", "Standard").required(),
    roomNumber: Joi.number().required()
})
const bookingAuthSchema = Joi.object({
    bookingStartDate : Joi.date().required(),
    bookingEndDate :Joi.date().required(),
    roomNumbers: Joi.array().items(Joi.string()).required()
})
const commentAuthSchema = Joi.object({
    message : Joi.string().required(),
    rating :Joi.number().required().min(0).max(5),
})
const OTPSchema = Joi.object({
    OTP: Joi.string().uppercase().required()
})
module.exports = {
    signupAuthSchema,
    roomAuthSchema,
    bookingAuthSchema,
    OTPSchema,
    commentAuthSchema
}