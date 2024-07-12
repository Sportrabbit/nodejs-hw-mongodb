import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

const errorHandler = (err, req, res, next) => {
    if (isHttpError(err)) {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
            data: err.errors,
        });
        return;
    }

    if (err instanceof MongooseError) {
        res.status(500).json({
            status: 500,
            message: 'Mongoose error',
            error: err.message,
        });
        return;
    }

    res.status(500).json({
        status: 500,
        message: 'Something went wrong',
        error: err.message,
    });
};

export default errorHandler;

