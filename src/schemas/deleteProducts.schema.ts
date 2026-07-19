import z from 'zod';

export const deleteProductSchema = z.object({
  ProductId: z.number().min(1, 'Adicione o id do produto que deseja deletar'),
});
