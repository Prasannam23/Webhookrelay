
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {env} from '../config/env.js';
import { UnauthorizedError } from '../errors/index.js';

const SALT_ROUNDS = 12;

async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}


function generateAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export {
  hashPassword,
  comparePassword,
  generateAccessToken,
  verifyAccessToken,
};