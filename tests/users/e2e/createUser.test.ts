import { describe, it, expect, afterAll, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/db/client';

describe('POST /createUser', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });
  afterEach(async () => {
    await prisma.users.deleteMany({
      where: {
        email: {
          startsWith: 'test',
        },
      },
    });
  });
  it('must create user successfuly', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: 'Test123#',
      userAddress: 'rua Test, numero 123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      username: 'test',
      message: 'Usuário criado com sucesso',
    });
  });

  it('must return: Usuário já existe', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: 'Test123#',
      userAddress: 'rua Test, numero 123',
    });
    const response2 = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: 'Test123#',
      userAddress: 'rua Test, numero 123',
    });

    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({
      message: 'Usuário já existe',
    });
  });

  it('must return: Email inválido', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail',
      password: 'Test123#',
      userAddress: 'rua Test, numero 123',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        email: ['Email inválido'],
      },
    });
  });

  it('must return: A senha deve ter no mínimo 8 caracteres', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: '',
      userAddress: 'rua Test, numero 123',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        password: ['A senha deve ter no mínimo 8 caracteres'],
      },
    });
  });

  it('must return: Deve conter pelo menos uma letra maiúscula', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: 'test123#',
      userAddress: 'rua Test, numero 123',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        password: ['Deve conter pelo menos uma letra maiúscula'],
      },
    });
  });

  it('must return: Deve conter pelo menos uma letra minúscula', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: 'TEST123#',
      userAddress: 'rua Test, numero 123',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        password: ['Deve conter pelo menos uma letra minúscula'],
      },
    });
  });

  it('must return: Deve conter pelo menos um número', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: 'Testall#',
      userAddress: 'rua Test, numero 123',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        password: ['Deve conter pelo menos um número'],
      },
    });
  });

  it('must return: Deve conter pelo menos um caractere especial', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: 'Test1234',
      userAddress: 'rua Test, numero 123',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        password: ['Deve conter pelo menos um caractere especial'],
      },
    });
  });

  it('must return: Precisa de um endereço', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'test@gmail.com',
      password: 'Test123#',
      userAddress: '',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        userAddress: ['Precisa de um endereço'],
      },
    });
  });

  it('must return: Precisa de um nome', async () => {
    const response = await request(app).post('/createUser').send({
      userName: '',
      email: 'test@gmail.com',
      password: 'Test123#',
      userAddress: 'rua Test, numero 123',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        userName: ['Precisa de um nome'],
      },
    });
  });

  it('must return: Nome muito grande', async () => {
    const response = await request(app).post('/createUser').send({
      userName:
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      email: 'test@gmail.com',
      password: 'Test123#',
      userAddress: 'rua Test, numero 123',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: {
        userName: ['Nome muito grande'],
      },
    });
  });
});
