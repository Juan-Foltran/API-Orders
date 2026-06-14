import { jest, describe, it, expect } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';
import { type DataRequest } from '../../../src/models/stores/stores.types';
import { PrismaClient } from '../../../src/db/generated/prisma/client';

const prismaMock = mockDeep<PrismaClient>();
jest.unstable_mockModule('../../../src/db/client.js', () => ({
  prisma: prismaMock,
}));

const { addRequest } = await import('./../../../src/models/stores/reqCreateStores.model');

describe('testing model request create store', () => {
  it('should create new request succesfuly', async () => {
    const data: DataRequest = {
      userId: 1,
      nameStore: 'lanches do big',
      contactEmail: 'lanchesdobig@gmail.com',
      cnpj: '12321455465567',
      storeAddress: 'Rua B, endereço 123',
      category: 'fastfood',
    };

    prismaMock.storeRequest.findUnique.mockResolvedValue(null);
    prismaMock.stores.findUnique.mockResolvedValue(null);
    prismaMock.storeRequest.create.mockResolvedValue({
      id: 1,
      userId: data.userId,
      nameStore: data.nameStore,
      contactEmail: data.contactEmail,
      cnpj: data.cnpj,
      storeAddress: data.storeAddress,
      category: data.category,
    } as any);

    const result = await addRequest(data);
    expect(result).toEqual({
      StoreName: result.StoreName,
      message:
        'Agradecemos seu interesse em fazer essa parceria com nosso app, a partir de agora analisaremos seus dados',
    });
  });

  it('should return error when trying to create new request with already existing cnpj in a request', async () => {
    const data: DataRequest = {
      userId: 1,
      nameStore: 'lanches do big',
      contactEmail: 'lanchesdobig@gmail.com',
      cnpj: '12321455465567',
      storeAddress: 'Rua B, endereço 123',
      category: 'fastfood',
    };

    prismaMock.storeRequest.findUnique.mockResolvedValue({
      id: 1,
      userId: data.userId,
      nameStore: data.nameStore,
      contactEmail: data.contactEmail,
      cnpj: data.cnpj,
      storeAddress: data.storeAddress,
      category: data.category,
    } as any);
    prismaMock.stores.findUnique.mockResolvedValue(null);

    await expect(addRequest(data)).rejects.toThrow('já existe requisição para a criação de uma loja com esse CNPJ');
    expect(prismaMock.storeRequest.create).not.toHaveBeenCalled();
  });

  it('should return error when trying to create new request with already existing in a store with same cnpj', async () => {
    const data: DataRequest = {
      userId: 1,
      nameStore: 'lanches do big',
      contactEmail: 'lanchesdobig@gmail.com',
      cnpj: '12321455465567',
      storeAddress: 'Rua B, endereço 123',
      category: 'fastfood',
    };

    prismaMock.storeRequest.findUnique.mockResolvedValue(null);
    prismaMock.stores.findUnique.mockResolvedValue({
      id: 1,
      userId: data.userId,
      nameStore: data.nameStore,
      contactEmail: data.contactEmail,
      cnpj: data.cnpj,
      storeAddress: data.storeAddress,
      category: data.category,
    } as any);

    await expect(addRequest(data)).rejects.toThrow('já existe uma loja com esse CNPJ');
    expect(prismaMock.storeRequest.create).not.toHaveBeenCalled();
  });
});
