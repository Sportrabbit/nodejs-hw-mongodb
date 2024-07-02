import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';

const testRouter = Router();

testRouter.get('/test', authenticate, (req, res) => {
  res.status(200).send('Authentication successful');
});

export default testRouter;
