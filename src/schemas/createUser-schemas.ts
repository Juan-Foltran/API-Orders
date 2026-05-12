import { z } from 'zod';

const schemaPassword = z.string().superRefine((value, ctx) => {
  if (value.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A senha deve ter no mínimo 8 caracteres',
    });

    return;
  }

  if (!/[A-Z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Deve conter pelo menos uma letra maiúscula',
    });
  }

  if (!/[a-z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Deve conter pelo menos uma letra minúscula',
    });
  }

  if (!/[0-9]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Deve conter pelo menos um número',
    });
  }

  if (!/[!@#$%^&*]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Deve conter pelo menos um caractere especial',
    });
  }
});

export const createUserSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Precisa de um email'),
  password: schemaPassword,
  userAddress: z.string().min(1, 'Precisa de um endereço').max(100).trim(),
  userName: z.string().min(1, 'Precisa de um nome').max(150, 'Nome muito grande').trim(),
});
