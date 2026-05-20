import { type Request, type Response } from 'express';
import { auth } from '../../models/users/login.model.js';
import { schemaLogin } from '../../schemas/login.schema.js';

export const login = async (req: Request, res: Response) => {
  const result = schemaLogin.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const token = await auth(result.data);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 1000,
    });

    return res.status(200).json({ message: 'login feito com sucesso' });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(401).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
