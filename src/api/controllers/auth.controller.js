import { prisma } from '../../db/client.js';
import { hashPassword, comparePassword, generateAccessToken } from '../../services/auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { AppError } from '../../errors/index.js';

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash } });
  const token = generateAccessToken(user);
  return sendSuccess(res, {
    statusCode: 201,
    data: { user: { id: user.id, email: user.email }, token },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }
  const token = generateAccessToken(user);
  return sendSuccess(res, {
    data: { user: { id: user.id, email: user.email }, token },
  });
});

const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, { data: { user: req.user } });
});

export default { register, login, me };