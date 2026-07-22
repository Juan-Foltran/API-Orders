import { type Request, type Response } from 'express';
import { listProducts } from '../../models/stores/listProducsts.model.js';
import { getStores } from '../../models/stores/createProducts.model.js';
import { listProductsSchema } from '../../schemas/listProducts.schemas.js';

export const listingProducts = async (req: Request, res: Response) => {
  const result = listProductsSchema.safeParse(req.params);
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

    const storeId = data.storeId;

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

    const products = await listProducts(storeId);

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
