import { z } from 'zod';

export const schemaRequest = z.object({
  nameStore: z.string().min(1, 'Sua loja precisa de um nome').max(150, 'Nome muito grande').trim(),
  contactEmail: z.string().email().min(1, 'Informe o email para contato').trim().max(150, 'Email muito grande'),
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos'),
  storeAddres: z.string().min(1, 'Precisa informar o endereço da sua loja').trim().max(255),
  category: z.string().min(1, 'Informe a categoria da sua loja').trim().max(100, 'informe de uma forma mais resumida'),
});
