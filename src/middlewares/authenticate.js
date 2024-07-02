import createHttpError from 'http-errors';
import { Users } from '../validation/userValidation.js';
import { Session } from '../validation/sessionValidation.js';

const SECRET_KEY = process.env.SECRET_KEY;

export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
      next(createHttpError(401, 'Please provide Authorization header'));
      return;
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    console.log('Bearer:', bearer);
    console.log('Token:', token);

    if (bearer !== 'Bearer' || !token) {
      next(createHttpError(401, 'Auth header should be of type Bearer'));
      return;
    }

    const session = await Session.findOne({ accessToken: token });
    console.log('Session:', session);

    if (!session) {
      next(createHttpError(401, 'Session not found'));
      return;
    }

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
      next(createHttpError(401, 'Access token expired'));
    }

    const user = await Users.findById(session.userId);
    console.log('User:', Users);

    if (!user) {
      next(createHttpError(401));
      return;
    }

    req.user = user;

    next();
};


