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
        store: true,
      },
    });

    return deleting;
  } catch (err) {
    console.log(err);
    throw new Error('Falha ao deletar o produto');
  }
};
