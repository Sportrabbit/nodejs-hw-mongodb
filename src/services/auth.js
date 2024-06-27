import createHttpError from 'http-errors';
import { User } from '../validation/userValidation.js';
import bcrypt from 'bcrypt';
import { Session } from '../validation/sessionValidation.js';

const SECRET_KEY = process.env.SECRET_KEY;

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    return { id: newUser._id, name: newUser.name, email: newUser.email };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    throw new Error('Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '30d' });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
  });

  return {accessToken, refreshToken};
};

export const refreshSession = async ({ sessionId, sessionToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired!');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.deleteOne({ _id: sessionId });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};

export const logoutUser = async ({ sessionId, sessionToken }) => {
  return await Session.deleteOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });
};
