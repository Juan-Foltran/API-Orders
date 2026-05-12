import bcrypt from 'bcrypt';
import { type DataCreate } from './users.types.js';
import { prisma } from '../../db/client.js';

const userExists = async (userEmail: string) => {
  const data = await prisma.users.findUnique({
    where: {
      email: userEmail,
    },
  });

  return data;
};
const createUser = async (email: string, password: string, userAddress: string, userName: string) => {
  const user = await prisma.users.create({
    data: {
      email,
      password,
      userAddress,
      userName,
    },
  });
  return user;
};
export const addUser = async (data: DataCreate) => {
  const exists = await userExists(data.email);
  if (exists) {
    throw new Error('Usuário já existe');
  }

  try {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await createUser(data.email, hash, data.userAddress, data.userName);
    return {
      username: newUser.userName,
      message: 'Usuário criado com sucesso',
    };
  } catch (err) {
    console.error(err);
    throw new Error('Erro interno no servidor');
  }
};
