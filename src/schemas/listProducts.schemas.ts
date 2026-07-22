import z from 'zod';

export const listProductsSchema = z.object({
  storeId: z.coerce.number().min(1, 'Adicione o id da sua loja'),
});
