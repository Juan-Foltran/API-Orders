import { jest, describe, it, expect } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient, RequestStatus } from '../../../src/db/generated/prisma/client';

const prismaMock = mockDeep<PrismaClient>();
jest.unstable_mockModule('../../../src/db/client.js', () => ({
  prisma: prismaMock,
}));

const { listRequest } = await import('../../../src/models/stores/listRequests');

describe('model test of listing request for create store', () => {
  const requestsMock = [
    {
      id: 1,
      userId: 1,
      nameStore: 'store-tester',
      contactEmail: 'contactEmail_test@gmail.com',
      cnpj: '12345678901234',
      storeAddress: 'rua a, numero B',
      category: 'test',
      status: RequestStatus.PENDING,
      createdAt: new Date('2026-06-09T16:07:44.421Z'),
    },
  ];
  it('should list all requests successfuly', async () => {
    prismaMock.storeRequest.findMany.mockResolvedValue(requestsMock);

    const result = await listRequest();
    expect(prismaMock.storeRequest.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'asc',
      },
    });

    expect(result).toEqual(requestsMock);
  });
});
