import { type Request, type Response } from 'express';
import { getStatus } from '../../models/stores/statusRequest.model.js';

export const listMyRequests = async (req: Request, res: Response) => {
  const id: number = res.locals.user.id;
  try {
    const status = await getStatus(id);

    return res.status(200).json(status);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
