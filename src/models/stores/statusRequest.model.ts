import { prisma } from '../../db/client.js';

export const getStatus = async (id: number) => {
  const result = await prisma.storeRequest.findMany({
    where: {
      userId: id,
    },
    select: {
      nameStore: true,
      status: true,
    },
  });

  return result;
};
