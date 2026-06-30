import { describe, it, expect, afterAll, afterEach, beforeAll } from '@jest/globals';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../../../src/app';
import { prisma } from '../../../src/db/client';

describe('POST /RequestStore', () => {
  beforeAll(async () => {
    await prisma.storeRequest.deleteMany({
      where: {
        contactEmail: {
          startsWith: 'contactEmail_test',
        },
      },
    });
    await prisma.stores.deleteMany({
      where: {
        contactEmail: {
          startsWith: 'contactEmail_test',
        },
      },
    });
    await prisma.users.deleteMany({
      where: {
        email: {
          startsWith: 'createRequest_test',
        },
      },
    });

    const hashedPassword = await bcrypt.hash('Test123#', 10);
    await prisma.users.create({
      data: {
        userName: 'test',
        email: 'createRequest_test@gmail.com',
        password: hashedPassword,
        userAddress: 'rua Test, numero 123',
      },
    });
  });

  afterAll(async () => {
    await prisma.storeRequest.deleteMany({
      where: {
        contactEmail: {
          startsWith: 'contactEmail_test',
        },
      },
    });
    await prisma.stores.deleteMany({
      where: {
        contactEmail: {
          startsWith: 'contactEmail_test',
        },
      },
    });
    await prisma.users.deleteMany({
      where: {
        email: {
          startsWith: 'createRequest_test',
        },
      },
    });
    await prisma.$disconnect();
  });

  it('should create request successfuly', async () => {
    const login = await request(app).post('/login').send({
      email: 'createRequest_test@gmail.com',
      password: 'Test123#',
    });

    expect(login.status).toBe(200);

    const cookies = login.headers['set-cookie'];
    const response = await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: 'teste',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '12312324456869',
      storeAddress: 'Rua josezinho de queiroz, numero 42343',
      category: 'sanduiche',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      StoreName: 'teste',
      message:
        'Agradecemos seu interesse em fazer essa parceria com nosso app, a partir de agora analisaremos seus dados',
    });
  });

  it('should create request unsuccessfuly when already exist one request with same cnpj', async () => {
    const login = await request(app).post('/login').send({
      email: 'createRequest_test@gmail.com',
      password: 'Test123#',
    });

    expect(login.status).toBe(200);

    const cookies = login.headers['set-cookie'];

    await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: 'teste',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '12312324456869',
      storeAddress: 'Rua josezinho de queiroz, numero 42343',
      category: 'sanduiche',
    });

    const response = await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: 'teste',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '12312324456869',
      storeAddress: 'Rua josezinho de queiroz, numero 42343',
      category: 'sanduiche',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'já existe requisição para a criação de uma loja com esse CNPJ',
    });
  });

  it('should create request unsuccessfuly when already exist one store with same cnpj', async () => {
    const login = await request(app).post('/login').send({
      email: 'createRequest_test@gmail.com',
      password: 'Test123#',
    });

    expect(login.status).toBe(200);

    const cookies = login.headers['set-cookie'];

    const user = await prisma.users.findUnique({
      where: {
        email: 'createRequest_test@gmail.com',
      },
    });

    expect(user).not.toBeNull();

    await prisma.stores.create({
      data: {
        nameStore: 'teste',
        contactEmail: 'contactEmail_test@gmail.com',
        cnpj: '12312324456869',
        storeAddress: 'Rua josezinho de queiroz, numero 42343',
        category: 'sanduiche',
        ownerId: user!.id,
      },
    });

    const response = await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: 'teste',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '12312324456869',
      storeAddress: 'Rua josezinho de queiroz, numero 42343',
      category: 'sanduiche',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'já existe requisição para a criação de uma loja com esse CNPJ',
    });
  });
  it('should create request unsuccessfuly when cnpj is empty', async () => {
    const login = await request(app).post('/login').send({
      email: 'createRequest_test@gmail.com',
      password: 'Test123#',
    });

    const cookies = login.headers['set-cookie'];

    const response = await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: 'teste',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '',
      storeAddress: 'Rua josezinho de queiroz, numero 42343',
      category: 'sanduiche',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveProperty('cnpj');
  });

  it('should create request unsuccessfuly when nameStore is empty', async () => {
    const login = await request(app).post('/login').send({
      email: 'createRequest_test@gmail.com',
      password: 'Test123#',
    });

    const cookies = login.headers['set-cookie'];

    const response = await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: '',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '12312324456869',
      storeAddress: 'Rua josezinho de queiroz, numero 42343',
      category: 'sanduiche',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveProperty('nameStore');
  });

  it('should create request unsuccessfuly when contactEmail is empty', async () => {
    const login = await request(app).post('/login').send({
      email: 'createRequest_test@gmail.com',
      password: 'Test123#',
    });

    const cookies = login.headers['set-cookie'];

    const response = await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: 'teste',
      contactEmail: '',
      cnpj: '12312324456869',
      storeAddress: 'Rua josezinho de queiroz, numero 42343',
      category: 'sanduiche',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveProperty('contactEmail');
  });

  it('should create request unsuccessfuly when storeAddress is empty', async () => {
    const login = await request(app).post('/login').send({
      email: 'createRequest_test@gmail.com',
      password: 'Test123#',
    });

    const cookies = login.headers['set-cookie'];

    const response = await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: 'teste',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '12312324456869',
      storeAddress: '',
      category: 'sanduiche',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveProperty('storeAddress');
  });

  it('should create request unsuccessfuly when category is empty', async () => {
    const login = await request(app).post('/login').send({
      email: 'createRequest_test@gmail.com',
      password: 'Test123#',
    });

    const cookies = login.headers['set-cookie'];

    const response = await request(app).post('/RequestStore').set('Cookie', cookies).send({
      nameStore: 'teste',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '12312324456869',
      storeAddress: 'Rua josezinho de queiroz, numero 42343',
      category: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveProperty('category');
  });
});
