import z from 'zod';

export const deleteProductSchema = z.object({
  productId: z.number().min(1, 'Adicione o id do produto que deseja deletar'),
});

export const paramsIdDeleteProductSchema = z.object({
  storeId: z.coerce.number().min(1, 'Adicione o id da sua loja'),
});
