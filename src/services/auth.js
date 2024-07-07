import createHttpError from 'http-errors';
import { User } from '../validation/userValidation.js';
import bcrypt from 'bcrypt';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs/promises';
import { sendEmail } from '../utils/sendEmail.js';
import { env } from '../utils/env.js';
import { Session } from '../validation/sessionValidation.js';
import { EMAIL_VARS, ENV_VARS, TEMPLATES_DIR } from '../constants/index.js';

const SECRET_KEY = process.env.SECRET_KEY;

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
        throw new Error('Email in use');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = await User.create({ name: payload.name, email: payload.email, password: hashedPassword });

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

  return { accessToken, refreshToken };
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

export const requestResetToken = async (email) => {
  console.log(`Received request to reset password for email: ${email}`);
  const user = await User.findOne({ email });

  if (!user) {
    console.log(`User not found for email: ${email}`);
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'send-reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath, 'utf8')
  );

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env(ENV_VARS.APP_DOMAIN)}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(EMAIL_VARS.SMTP_FROM),
      to: email,
      subject: 'Password Reset',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });

  await Session.deleteMany({ userId: user._id });
};
