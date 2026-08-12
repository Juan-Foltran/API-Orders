import z from 'zod';

export const listProductsForUserSchema = z.object({
  storeId: z.coerce.number().min(1, 'Adicione o id da loja'),
});
