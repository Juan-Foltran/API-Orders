import { prisma } from '../../db/client.js';
import { type creation } from './adm.types.js';

export const aproveOrReject = async (id: number, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
  const update = await prisma.storeRequest.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return update.status;
};

export const Role = async (userId: number): Promise<'USER' | 'OWNER' | 'ADMIN' | null> => {
  const result = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  return result?.role ?? null;
};

export const updateRole = async (userId: number, role: 'USER' | 'OWNER' | 'ADMIN') => {
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
};

export const verification = async (id: number) => {
  const result = await prisma.storeRequest.findUnique({
    where: {
      id,
    },
    select: {
      nameStore: true,
      contactEmail: true,
      cnpj: true,
      storeAddress: true,
      category: true,
      userId: true,
      status: true,
    },
  });

  if (result) {
    return result;
  }

  return null;
};

export const creationStore = async (data: creation) => {
  const result = await prisma.stores.create({
    data: {
      nameStore: data.nameStore,
      contactEmail: data.contactEmail,
      cnpj: data.cnpj,
      storeAddress: data.storeAddress,
      category: data.category,
      ownerId: data.userId,
    },
  });

  if (result) {
    return result;
  }

  return null;
};
