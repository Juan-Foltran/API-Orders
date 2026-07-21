import { type deleteProduct } from './stores.types.js';
import { prisma } from '../../db/client.js';

export const deleteProducts = async (product: deleteProduct) => {
  try {
    const deleting = await prisma.products.delete({
      where: {
        id: product.poductId,
        idStore: product.storeId,
      },
      select: {
        id: true,
        name: true,
        store: {
          select: {
            nameStore: true,
          },
        },
      },
    });

    return deleting;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      if (err.message.includes('not found') || err.message.includes('P2025')) {
        throw new Error('Esse produto não existe');
      }
    }
    throw new Error('Falha ao deletar o produto');
  }
};
