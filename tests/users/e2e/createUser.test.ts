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
          startsWith: 'create_test_',
        },
      },
    });
  });
  it('must create user successfuly', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'create_test_001@gmail.com',
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
      email: 'create_test_002@gmail.com',
      password: 'Test123#',
      userAddress: 'rua Test, numero 123',
    });
    const response2 = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'create_test_002@gmail.com',
      password: 'Test123#',
      userAddress: 'rua Test, numero 123',
    });

    expect(response2.status).toBe(400);
    expect(response2.body).toEqual({
      message: 'Já existe um usuário com esse email',
    });
  });

  it('must return: Email inválido', async () => {
    const response = await request(app).post('/createUser').send({
      userName: 'test',
      email: 'create_test@gmail',
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
      email: 'create_test_003@gmail.com',
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
      email: 'create_test_004@gmail.com',
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
      email: 'create_test_005@gmail.com',
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
      email: 'create_test_006@gmail.com',
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
      email: 'create_test_007@gmail.com',
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
      email: 'create_test_008@gmail.com',
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
      email: 'create_test_009@gmail.com',
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
      email: 'create_test_010@gmail.com',
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
