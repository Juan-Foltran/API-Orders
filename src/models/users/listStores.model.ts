import { prisma } from '../../db/client.js';

export const listStores = async () => {
  const result = prisma.stores.findMany({
    select: {
      idStore: true,
      nameStore: true,
      category: true,
      storeAddress: true,
    },
  });

  return result;
};
