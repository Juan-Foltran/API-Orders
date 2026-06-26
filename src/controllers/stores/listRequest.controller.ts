import { type Request, type Response } from 'express';
import { listRequest } from '../../models/stores/listRequests.js';

export const listing = async (req: Request, res: Response) => {
  try {
    const requests = await listRequest();

    return res.status(200).json(requests);
  } catch {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
