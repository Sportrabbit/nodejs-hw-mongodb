import Joi from 'joi';

export const Session = Joi.object({
    userId: Joi.string().required(),
    sessionId: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date(), 'time of creation'),
    updatedAt: Joi.date().default(() => new Date(), 'time of update'),
});
