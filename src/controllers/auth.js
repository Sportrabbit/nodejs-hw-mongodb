import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CreateError from 'http-errors';
import { User } from '../validation/userValidation.js';
import { Session } from '../validation/sessionValidation.js';

const SECRET_KEY = process.env.SECRET_KEY;
const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 хвилин
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 днів

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw CreateError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
} catch (error) {
    next(error);
}
};

export const loginUserController = async (req, res, next) => {
  try {
    const {email, password} = (req.body);

    const user = await User.findOne({ email });

    if (!user || await bcrypt.compare(password, user.password)) {
      throw createHttpError(401, 'Invalid email or password');
    }

    await Session.deleteMany({ userId: user._id });

    const { accessToken, refreshToken } = generateTokens(user._id);
    const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
    const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true});
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {accessToken},
    })

  } catch (error) {
    next(error);
  }

};

export const refreshTokenController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if(!refreshToken) {
      throw createHttpError(401, 'Refresh token missing!');
    }

    const session = await Session.findOne({ refreshToken });

    if(!session || session.refreshTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Refresh token invalid or expired!');
    }

    await Session.deleteOne({ _id: sessionId });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
    const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }

};

export const logoutUserController = async (req, res) => {
    await logoutUser({
      sessionId: req.cookies.sessionId,
      sessionToken: req.cookies.sessionToken,
    });

    res.clearCookie('sessionId');
    res.clearCookie('sessionToken');

    res.status(204).send();
};
