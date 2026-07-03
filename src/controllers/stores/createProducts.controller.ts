import { type Request, type Response } from 'express';
import { createProducts, getStores } from '../../models/stores/createProducts.model.js';
import { createProductSchema } from '../../schemas/createProducts.schema.js';

export const creation = async (req: Request, res: Response) => {
  const result = createProductSchema.safeParse(req.body);
  const id: number = res.locals.user.id;

  if (!result.success) {
    res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const data = result.data;

  try {
    const stores = await getStores(id);

    const storeId = data.idStore;

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

    const createNewProduct = await createProducts(data);
    return res.status(201).json(createNewProduct);
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
