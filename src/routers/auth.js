import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { requestResetEmailSchema } from '../validation/requestResetEmailSchema.js';
import { resetPasswordSchema } from '../validation/resetPasswordSchema.js';
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

authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController)
);

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default authRouter;
