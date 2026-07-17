import z from 'zod';

export const promptValidationSchema = z.object({
  body: z.object({
    prompt: z.string(),
  }),
});
