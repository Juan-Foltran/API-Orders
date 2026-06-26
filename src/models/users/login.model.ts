import { prisma } from '../../db/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { DataLogin } from './users.types.js';

export const auth = async (dataLogin: DataLogin) => {
  const user = await prisma.users.findUnique({
    where: {
      email: dataLogin.email,
    },
    select: {
      password: true,
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error('Email ou senha inválido');
  }
  const compare = await bcrypt.compare(dataLogin.password, user.password);

  if (!compare) {
    throw new Error('Email ou senha inválido');
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '10m',
  });

  return token;
};
