import { deleteProductSchema, paramsIdDeleteProductSchema } from '../../schemas/deleteProducts.schema.js';
import { deleteProducts } from '../../models/stores/deleteProducts.model.js';
import { getStores } from '../../models/stores/createProducts.model.js';
import { type Request, type Response } from 'express';

export const del = async (req: Request, res: Response) => {
  const paramsResult = paramsIdDeleteProductSchema.safeParse(req.params);
  const bodyResult = deleteProductSchema.safeParse(req.body);
  const id: number = res.locals.user.id;

  if (!bodyResult.success) {
    return res.status(400).json({
      errors: bodyResult.error.flatten().fieldErrors,
    });
  }

  if (!paramsResult.success) {
    return res.status(400).json({
      errors: paramsResult.error.flatten().fieldErrors,
    });
  }

  const { storeId } = paramsResult.data;
  const data = bodyResult.data;

  try {
    const stores = await getStores(id);

    let storeFound = false;

    stores.forEach((store) => {
      if (store.idStore === storeId) {
        storeFound = true;
      }
    });

    if (!storeFound) {
      return res.status(403).json({
        message: 'Essa loja não pertence a esse usuário',
      });
    }

    const dataProduct = {
      storeId: storeId,
      poductId: data.productId,
    };

    const deletingProduct = await deleteProducts(dataProduct);

    return res.status(200).json({ message: `Produto ${deletingProduct.name} deletado com sucesso` });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.status(500).json({
      message: 'Erro interno no servidor',
    });
  }
};
