import createHttpError from 'http-errors';
import { User } from '../validation/userValidation.js';
import { Session } from '../validation/sessionValidation.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
      next(createHttpError(401, 'Please provide Authorization header'));
      return;
    }

    const [bearer, token] = authHeader.split(' ');
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

    const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);
    console.log('Is Access Token Expired:', isAccessTokenExpired);

    if (isAccessTokenExpired) {
      next(createHttpError(401, 'Access token expired'));
      return;
    }

    const user = await User.findById(session.userId);
    console.log('User:', user);

    if (!user) {
      next(createHttpError(401));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(error);
  }
};
