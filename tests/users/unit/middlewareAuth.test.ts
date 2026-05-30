import { describe, it, expect, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../../src/middlewares/auth.middleware';

describe('test middleware auth', () => {
  it('must return status code 401 without token', () => {
    const req: any = {};
    const res: any = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    req.cookies = {};

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('must return status code 401 the token is modified', () => {
    const req: any = {};
    const res: any = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    req.cookies = { token: 'token123' };

    const decoded = { id: 1 };

    (jwt.verify as jest.Mock) = jest.fn().mockImplementation(() => {
      throw new Error('jwt malformed');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'token inválido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('must call next() and set user in res.locals when token is valid', () => {
    const validToken = 'token';
    const req: any = {};
    const res: any = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    req.cookies = { token: validToken };

    const decoded = { id: 1 };

    (jwt.verify as jest.Mock) = jest.fn().mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(res.locals.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toBeCalled();
  });
});
