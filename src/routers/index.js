import { Router } from "express";
import authRouter from './auth.js';
import router from "./contacts";

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/contacts', router);
rootRouter.use('/test', testRouter);

export default rootRouter;
