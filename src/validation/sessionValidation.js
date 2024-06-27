import Joi, { date } from "joi";

export const userSchema = Joi.object({
    userId: Joi.string().required(),
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
    accessTokenValidUntil: Joi.Date().required(),
    updatedAt: Joi.Date().required(),
});
