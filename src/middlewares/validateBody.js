import createHttpError from 'http-errors';

const validateBody = (schema) => async (req, res, next) => {
    try {
        console.log('Validating body:', req.body);
        await schema.validateAsync(req.body, {abortEarly: false});
        next();
    } catch (error) {
        console.error('Validation error:', error.details);
        const err = createHttpError(400, 'Bad request', {
            errors: error.details,
        });
        next(err);
    }
};

export default validateBody;
