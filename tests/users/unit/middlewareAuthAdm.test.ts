import { describe, it, expect, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authAdm } from '../../../src/middlewares/authAdm.middleware';

describe('test middleware auth Adm', () => {
  it('must return status code 401 without token', () => {
    const req: any = {};
    const res: any = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    req.cookies = {};

    authAdm(req, res, next);

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

    authAdm(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'token inválido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('must return status code 403 the user is not Admin', () => {
    const validToken = 'token';
    const req: any = {};
    const res: any = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    req.cookies = { token: validToken };

    const decoded = { id: 1, role: 'USER' };

    (jwt.verify as jest.Mock) = jest.fn().mockReturnValue(decoded);

    authAdm(req, res, next);

    expect(res.locals.user).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith({ error: 'Apenas administradores podem acessar.' });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('must call next() when the user is Admin', () => {
    const validToken = 'token';
    const req: any = {};
    const res: any = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    req.cookies = { token: validToken };

    const decoded = { id: 1, role: 'ADMIN' };

    (jwt.verify as jest.Mock) = jest.fn().mockReturnValue(decoded);

    authAdm(req, res, next);

    expect(res.locals.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toBeCalled();
  });
});
