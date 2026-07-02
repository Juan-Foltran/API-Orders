import { prisma } from '../../db/client.js';

export const listRequest = async () => {
  const requests = await prisma.storeRequest.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });
  return requests;
};
