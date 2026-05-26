import { describe, it, expect, jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '../../../src/db/generated/prisma/client';
import { role } from '../../../src/db/generated/prisma/enums';
import bcrypt from 'bcrypt';

const prismaMock = mockDeep<PrismaClient>();
process.env.JWT_SECRET = 'test-secret';

jest.unstable_mockModule('../../../src/db/client.js', () => ({
  prisma: prismaMock,
}));

const { auth } = await import('../../../src/models/users/login.model');

describe('generate a token', () => {
  it('generate a jwt token successfuly', async () => {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const dataLogin = {
      email: 'test@example.com',
      password: 'test123',
    };

    prismaMock.users.findUnique.mockResolvedValue({
      id: 1,
      role: role.USER,
      email: 'test@example.com',
      password: hashedPassword,
      userAddress: 'Rua A, numero 1234',
      userName: 'Test',
    });

    const result = await auth(dataLogin);

    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('must throw error when email is invalid', async () => {
    const dataLogin = {
      email: 'test@example.com',
      password: 'test123',
    };

    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(auth(dataLogin)).rejects.toThrow('Email ou senha inválido');
  });

  it('must throw error when password is invalid', async () => {
    const hashedPassword = await bcrypt.hash('test123', 10);
    const dataLogin = {
      email: 'test@example.com',
      password: 'test1234',
    };

    prismaMock.users.findUnique.mockResolvedValue({
      id: 1,
      role: role.USER,
      email: 'test@example.com',
      password: hashedPassword,
      userAddress: 'Rua A, numero 1234',
      userName: 'Test',
    });

    await expect(auth(dataLogin)).rejects.toThrow('Email ou senha inválido');
  });
});
