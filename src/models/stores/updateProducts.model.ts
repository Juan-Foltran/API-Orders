import { prisma } from '../../db/client.js';
import { type updateProduct } from './stores.types.js';

export const updatingProduct = async (data: updateProduct) => {
  try {
    const update = await prisma.products.update({
      where: {
        id: data.id,
        idStore: data.storeId,
      },
      data: {
        ...(data.title !== undefined && { name: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
      },
      select: {
        name: true,
      },
    });

    return update;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      if (err.message.includes('not found') || err.message.includes('P2025')) {
        throw new Error('Esse produto não existe');
      }
    }
    throw new Error('Falha ao atualizar o produto');
  }
};
