import Joi from 'joi';

const { date } = Joi;

export const Session = Joi.object({
    userId: Joi.string().required(),
    sessionId: Joi.string().required(),
    createdAt: date().default(Date.now),
    updatedAt: date().default(Date.now),
});
