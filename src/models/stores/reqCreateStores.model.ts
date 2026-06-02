import { prisma } from '../../db/client.js';
import type { DataRequest } from './stores.types.js';

const storeExist = async (cnpj: string) => {
  const dataStore = await prisma.stores.findUnique({
    where: {
      cnpj,
    },
  });

  return !!dataStore;
};

const reqCreateStore = async (
  userId: number,
  nameStore: string,
  contactEmail: string,
  cnpj: string,
  storeAddress: string,
  category: string,
) => {
  const request = await prisma.storeRequest.create({
    data: {
      userId,
      nameStore,
      contactEmail,
      cnpj,
      storeAddress,
      category,
    },
  });

  return request;
};

export const addRequest = async (data: DataRequest): Promise<string> => {
  const thisStoreExist = await storeExist(data.cnpj);
  if (thisStoreExist) {
    throw new Error('já existe uma loja com esse CNPJ');
  }

  try {
    const request = await reqCreateStore(
      data.userId,
      data.nameStore,
      data.contactEmail,
      data.cnpj,
      data.storeAddress,
      data.category,
    );

    return `Agradecemos seu interesse em fazer essa parceria com nosso app, a partir de agora analisaremos seus dados`;
  } catch (err) {
    throw new Error('Erro a abrir requisição para criar a loja em nosso app');
  }
};
