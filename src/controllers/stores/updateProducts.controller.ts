import { updatingProduct } from '../../models/stores/updateProducts.model.js';
import { getStores } from '../../models/stores/createProducts.model.js';
import { type Request, type Response } from 'express';
import { updateSchema, paramsIdUpdateProductSchema } from '../../schemas/updatePorducts.schema.js';

export const update = async (req: Request, res: Response) => {
  const paramsResult = paramsIdUpdateProductSchema.safeParse(req.params);
  const result = updateSchema.safeParse(req.body);
  const id: number = res.locals.user.id;

  if (!result.success) {
    res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  if (!paramsResult.success) {
    return res.status(400).json({
      errors: paramsResult.error.flatten().fieldErrors,
    });
  }

  const dataBody = result.data;
  const { storeId } = paramsResult.data;

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

    const data = {
      storeId: storeId,
      id: dataBody.productId,
      title: dataBody.title,
      description: dataBody.description,
      price: dataBody.price,
    };

    await updatingProduct(data);
    return res.status(200).json({
      message: 'O produto foi atualizado com sucesso',
    });
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
