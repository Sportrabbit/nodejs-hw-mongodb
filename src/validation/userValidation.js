import Joi from 'joi';

export const User = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date(), 'time of creation'),
    updatedAt: Joi.date().default(() => new Date(), 'time of update'),
});
