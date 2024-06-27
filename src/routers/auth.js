import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../validation/authValidation.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post('/login', validateBody(loginUserSchema),ctrlWrapper(loginUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/refresh-token', ctrlWrapper(refreshTokenController));

export default authRouter;
