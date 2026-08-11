import { listStores } from '../../models/users/listStores.model.js';
import { type Request, type Response } from 'express';

export const listingStores = async (req: Request, res: Response) => {
  try {
    const list = await listStores();

    return res.status(200).json(list);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
