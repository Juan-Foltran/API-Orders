import z from 'zod';

export const schemaLogin = z.object({
  email: z.string().min(1, 'Precisa de um email').trim(),
  password: z.string().min(1, 'Precisa de um senha').trim(),
});
