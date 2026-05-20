import { type Request, type Response } from 'express';
import { createUserSchema } from '../../schemas/createUser.schema.js';
import { addUser } from '../../models/users/create.model.js';

export const createUser = async (req: Request, res: Response) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
  }

  const data = result.data;

  try {
    const createNewUser = await addUser(data);

    return res.status(201).json(createNewUser);
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
