import { describe, it, expect, afterAll, beforeAll } from '@jest/globals';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../../src/app';
import { role } from '../../../src/db/generated/prisma/client';
import { prisma } from '../../../src/db/client';

describe('GET /requests', () => {
  beforeAll(async () => {
    await prisma.users.deleteMany({
      where: {
        email: {
          startsWith: 'listRequest_test',
        },
      },
    });

    const hashedPassword = await bcrypt.hash('Test123#', 10);

    await prisma.users.create({
      data: {
        userName: 'test',
        email: 'listRequest_test_ADM@gmail.com',
        password: hashedPassword,
        userAddress: 'rua Test, numero 123',
        role: role.ADMIN,
      },
    });

    await prisma.users.create({
      data: {
        userName: 'test',
        email: 'listRequest_test@gmail.com',
        password: hashedPassword,
        userAddress: 'rua Test, numero 123',
        role: role.USER,
      },
    });
  });

  afterAll(async () => {
    await prisma.users.deleteMany({
      where: {
        email: {
          startsWith: 'listRequest_test',
        },
      },
    });
  });

  it('should list all request successfuly', async () => {
    const login = await request(app).post('/login').send({
      email: 'listRequest_test_ADM@gmail.com',
      password: 'Test123#',
    });

    expect(login.status).toBe(200);

    const cookies = login.headers['set-cookie'];
    const response = await request(app).get('/requests').set('Cookie', cookies);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return: acesso negado, when you are not logged in', async () => {
    const response = await request(app).get('/requests');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Acesso negado' });
  });

  it('should return: acesso negado, when you are not logged in', async () => {
    const login = await request(app).post('/login').send({
      email: 'listRequest_test@gmail.com',
      password: 'Test123#',
    });

    expect(login.status).toBe(200);

    const cookies = login.headers['set-cookie'];
    const response = await request(app).get('/requests').set('Cookie', cookies);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Apenas administradores podem acessar.' });
  });
});
