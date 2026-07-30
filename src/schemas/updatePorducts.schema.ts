import z from 'zod';

export const paramsIdUpdateProductSchema = z.object({
  storeId: z.coerce.number().min(1, 'Adicione o id da sua loja'),
});

export const updateSchema = z
  .object({
    productId: z.number().min(1, 'Adicione o id do produto'),
    title: z.string().min(1, 'Preencha esse campo').max(70, 'Titulo muito grande').optional(),
    description: z.string().min(1, 'Preencha esse campo').max(300, 'Descrição muito grande').optional(),
    price: z
      .number()
      .positive()
      .refine((value) => Number.isInteger(value * 100), 'O preço deve ter no máximo duas casas decimais')
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.description !== undefined || data.price !== undefined, {
    message: 'Envie pelo menos um desses campos: title, description ou price, para atualizar',
    path: ['update error'],
  });
