import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authAdm = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Apenas administradores podem acessar.' });
    }

    res.locals.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'token inválido',
    });
  }
};
