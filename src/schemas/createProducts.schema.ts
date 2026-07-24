import z from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(1, 'Preencha esse campo').max(70, 'Titulo muito grande'),
  description: z.string().min(1, 'Preencha esse campo').max(300, 'Descrição muito grande'),
  price: z
    .number()
    .positive()
    .refine((value) => Number.isInteger(value * 100), 'O preço deve ter no m[aximo duas casas decimais'),
});

export const paramsIdCreateProductSchema = z.object({
  storeId: z.coerce.number().min(1, 'Adicione o id da sua loja'),
});
