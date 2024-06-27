import Joi, { date } from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().unique().required(),
    password: Joi.string().required(),
    createdAt: Joi.Date().default(Date.now),
    updatedAt: Joi.Date().default(Date.now),
});
