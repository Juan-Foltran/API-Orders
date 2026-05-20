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
    },
  });

  if (!user) {
    throw new Error('Usuário não existe');
  }
  const compare = await bcrypt.compare(dataLogin.password, user.password);

  if (!compare) {
    throw new Error('Senha inválida');
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1m',
  });

  return token;
};
