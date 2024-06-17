import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import mongoose from 'mongoose';

import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', 3000));
const MONGODB_URI = env('MONGODB_URI');

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

    app.use('/api', contactsRouter);

    app.use('*', notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    mongoose.connect(env('MONGODB_URI'), { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Mongo connection successfully established!'))
        .catch(err => console.error('Failed to connect to MongoDB', err));
};
