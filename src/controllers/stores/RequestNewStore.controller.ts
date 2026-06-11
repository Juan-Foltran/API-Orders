import { schemaRequest } from '../../schemas/requestCreateStore.schema.js';
import { addRequest } from '../../models/stores/reqCreateStores.model.js';
import { type Request, type Response } from 'express';

export const newRequest = async (req: Request, res: Response) => {
  const result = schemaRequest.safeParse(req.body);
  const id: number = res.locals.user.id;

  if (!result.success) {
    res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const data = result.data;

  try {
    const dataReq = {
      userId: id,
      nameStore: data.nameStore,
      contactEmail: data.contactEmail,
      cnpj: data.cnpj,
      storeAddress: data.storeAddress,
      category: data.category,
    };
    const request = await addRequest(dataReq);

    return res.status(201).json(request);
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
