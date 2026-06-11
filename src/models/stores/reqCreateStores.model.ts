import { prisma } from '../../db/client.js';
import type { DataRequest } from './stores.types.js';

const reqStoreExist = async (cnpj: string) => {
  const dataReqStore = await prisma.storeRequest.findUnique({
    where: {
      cnpj: cnpj,
    },
  });

  return dataReqStore;
};

const StoreExist = async (cnpj: string) => {
  const dataStore = await prisma.stores.findUnique({
    where: {
      cnpj,
    },
  });

  return dataStore;
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

export const addRequest = async (data: DataRequest) => {
  const thisRequestExist = await reqStoreExist(data.cnpj);
  const thisStoreExist = await StoreExist(data.cnpj);

  if (thisRequestExist) {
    throw new Error('já existe requisição para a criação de uma loja com esse CNPJ');
  } else if (thisStoreExist) {
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

    return {
      StoreName: request.nameStore,
      message:
        'Agradecemos seu interesse em fazer essa parceria com nosso app, a partir de agora analisaremos seus dados',
    };
  } catch (err) {
    throw new Error('Erro a abrir requisição para criar a loja em nosso app');
  }
};
