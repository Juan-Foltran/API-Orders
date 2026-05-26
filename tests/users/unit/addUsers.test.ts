import { describe, it, expect, jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';
import { type DataCreate } from '../../../src/models/users/users.types';
import { role } from '../../../src/db/generated/prisma/enums';
import { PrismaClient } from '../../../src/db/generated/prisma/client';

const prismaMock = mockDeep<PrismaClient>();

jest.unstable_mockModule('../../../src/db/client.js', () => ({
  prisma: prismaMock,
}));

const { addUser } = await import('../../../src/models/users/create.model');

describe('create user', () => {
  it('create user successfuly', async () => {
    const dataUser: DataCreate = {
      email: 'create_test_001@example.com',
      password: 'test123',
      userAddress: 'Rua A, numero 1234',
      userName: 'Test',
    };

    const fakeUser = {
      id: 1,
      role: role.USER,
      ...dataUser,
    };

    prismaMock.users.findUnique.mockResolvedValue(null);
    prismaMock.users.create.mockResolvedValue(fakeUser);

    const result = await addUser(dataUser);

    expect(result).toEqual({
      username: dataUser.userName,
      message: 'Usuário criado com sucesso',
    });

    expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
      where: { email: dataUser.email },
    });
  });

  it('create user without success', async () => {
    const dataUser: DataCreate = {
      email: 'create_test_002@example.com',
      password: 'test123',
      userAddress: 'Rua A, numero 1234',
      userName: 'Test',
    };

    const fakeUser = {
      id: 1,
      role: role.USER,
      ...dataUser,
    };

    prismaMock.users.findUnique.mockResolvedValue(fakeUser);

    await expect(addUser(dataUser)).rejects.toThrow('Já existe um usuário com esse email');
    expect(prismaMock.users.create).not.toHaveBeenCalled();
  });
});
