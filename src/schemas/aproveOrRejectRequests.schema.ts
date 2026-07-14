import z from 'zod';

export const schemaAproveOrReject = z.object({
  idStore: z.number().min(1, 'Adicione o id da loja'),
  // Alinhar os valores com o enum do banco: PENDING, APPROVED, REJECTED
  status: z.enum(['APPROVED', 'REJECTED', 'PENDING'], 'Apenas use: APPROVED, REJECTED ou PENDING'),
});
