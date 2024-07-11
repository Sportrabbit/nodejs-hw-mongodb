import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';

import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import  authRouter  from './routers/auth.js';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        }),
    );

    app.get('/', (req, res) => {
        res.send('API is running...');
    });

    app.use('/contacts', contactsRouter);

    app.use('/auth', authRouter);

    app.use('/uploads', express.static(UPLOAD_DIR));

    app.use('*', notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
