import Joi from 'joi';

export const Session = Joi.object({
    userId: Joi.string().required(),
    sessionId: Joi.string().required(),
});
