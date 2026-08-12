import { type Request, type Response } from 'express';
import { findStoreForUser, listProductsForUser } from '../../models/users/listProductsForUser.model.js';
import { listProductsForUserSchema } from '../../schemas/listProductsForuser.schema.js';

export const listingForUser = async (req: Request, res: Response) => {
  const result = listProductsForUserSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const storeId = result.data.storeId;
    const store = await findStoreForUser(storeId);

    if (!store) {
      return res.status(404).json({
        message: 'Loja não encontrada',
      });
    }

    const products = await listProductsForUser(storeId);

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
