import z from 'zod';

export const deleteProductSchema = z.object({
  storeId: z.number().min(1, 'Adicione o id da sua loja'),
  productId: z.number().min(1, 'Adicione o id do produto que deseja deletar'),
});
