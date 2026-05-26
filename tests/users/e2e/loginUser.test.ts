import { describe, it, expect, afterAll, afterEach, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/db/client';
import bcrypt from 'bcrypt';

describe('/POST login', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('Test123#', 10);
    await prisma.users.create({
      data: {
        userName: 'test',
        email: 'login_test@gmail.com',
        password: hashedPassword,
        userAddress: 'rua Test, numero 123',
      },
    });
  });

  afterAll(async () => {
    await prisma.users.deleteMany({
      where: {
        email: {
          startsWith: 'login_test',
        },
      },
    });
    await prisma.$disconnect();
  });

  it('must login in successfuly', async () => {
    const response = await request(app).post('/login').send({
      email: 'login_test@gmail.com',
      password: 'Test123#',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'login feito com sucesso',
    });
  });

  it('must login in unsuccessfully when the email is incorect', async () => {
    const response = await request(app).post('/login').send({
      email: 'login_@gmail.com', // email correct => login_test@gmail.com
      password: 'Test123#',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Email ou senha inválido',
    });
  });

  it('must login in unsuccessfully when the password is incorect', async () => {
    const response = await request(app).post('/login').send({
      email: 'login_test@gmail.com',
      password: 'Test#', // password correct => Test123#
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Email ou senha inválido',
    });
  });

  it('must return: Precisa de um senha', async () => {
    const response = await request(app).post('/login').send({
      email: 'login_test@gmail.com',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        password: ['Precisa de um senha'],
      },
    });
  });

  it('must return: deve conter uma senha', async () => {
    const response = await request(app).post('/login').send({
      email: '',
      password: 'Test123#',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        email: ['Precisa de um email'],
      },
    });
  });

  it('must return both erros', async () => {
    const response = await request(app).post('/login').send({
      email: '',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        email: ['Precisa de um email'],
        password: ['Precisa de um senha'],
      },
    });
  });
});
